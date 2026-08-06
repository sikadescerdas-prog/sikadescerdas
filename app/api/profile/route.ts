// app/api/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (
    typeof value === "object" &&
    "toNumber" in value &&
    typeof (value as { toNumber: () => number }).toNumber === "function"
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return unauthorized();
    }

    const user = await prisma.users.findUnique({
      where: { id: session.id },
      include: { profiles: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      profile: {
        fullname: user.profiles?.fullname ?? "",
        phone: user.profiles?.phone ?? "",
        bio: user.profiles?.bio ?? "",
        gender: user.profiles?.gender ?? "",
        birthDate:
          user.profiles?.birth_date?.toISOString().split("T")[0] ?? "",
        avatarUrl: user.profiles?.avatar_url ?? "",
        avatarPublicId: user.profiles?.avatar_public_id ?? "",
        province: user.profiles?.province ?? "",
        regency: user.profiles?.regency ?? "",
        district: user.profiles?.district ?? "",
        village: user.profiles?.village ?? "",
        detailAddress: user.profiles?.detail_address ?? "",
        latitude: toNumber(user.profiles?.latitude),
        longitude: toNumber(user.profiles?.longitude),
        isCompleted: user.profiles?.is_completed ?? false,
      },
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return unauthorized();
    }

    const body = await request.json();

    const {
      username,
      fullname,
      phone,
      bio,
      gender,
      birthDate,
      province,
      regency,
      district,
      village,
      detailAddress,
      latitude,
      longitude,
    } = body;

    if (!username?.trim()) {
      return NextResponse.json(
        { message: "Username wajib diisi." },
        { status: 400 }
      );
    }

    if (!fullname?.trim()) {
      return NextResponse.json(
        { message: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    const duplicate = await prisma.users.findFirst({
      where: {
        username: username.trim(),
        NOT: { id: session.id },
      },
      select: { id: true },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "Username sudah digunakan." },
        { status: 409 }
      );
    }

    const profileExists = await prisma.profiles.findUnique({
      where: { user_id: session.id },
      select: { id: true },
    });

    const normalizedPhone = phone?.trim() || null;
    const normalizedProvince = province?.trim() || null;
    const normalizedRegency = regency?.trim() || null;
    const normalizedDistrict = district?.trim() || null;
    const normalizedVillage = village?.trim() || null;
    const normalizedDetailAddress = detailAddress?.trim() || null;

    const normalizedLatitude =
      latitude !== null && latitude !== undefined && latitude !== ""
        ? Number(latitude)
        : null;

    const normalizedLongitude =
      longitude !== null && longitude !== undefined && longitude !== ""
        ? Number(longitude)
        : null;

    const isCompleted =
      Boolean(username.trim()) &&
      Boolean(fullname.trim()) &&
      Boolean(normalizedPhone) &&
      Boolean(normalizedProvince) &&
      Boolean(normalizedRegency) &&
      Boolean(normalizedDistrict) &&
      Boolean(normalizedVillage) &&
      Boolean(normalizedDetailAddress) &&
      normalizedLatitude !== null &&
      !Number.isNaN(normalizedLatitude) &&
      normalizedLongitude !== null &&
      !Number.isNaN(normalizedLongitude);

    console.log("PROFILE COMPLETED:", {
      username: username.trim(),
      fullname: fullname.trim(),
      phone: normalizedPhone,
      province: normalizedProvince,
      regency: normalizedRegency,
      district: normalizedDistrict,
      village: normalizedVillage,
      detailAddress: normalizedDetailAddress,
      latitude: normalizedLatitude,
      longitude: normalizedLongitude,
      isCompleted,
    });

    const result = await prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { id: session.id },
        data: {
          username: username.trim(),
          updated_at: new Date(),
        },
      });

      const profileData = {
        fullname: fullname.trim(),
        phone: normalizedPhone,
        bio: bio?.trim() || null,
        gender: gender || null,
        birth_date: birthDate ? new Date(birthDate) : null,
        province: normalizedProvince,
        regency: normalizedRegency,
        district: normalizedDistrict,
        village: normalizedVillage,
        detail_address: normalizedDetailAddress,
        latitude: normalizedLatitude,
        longitude: normalizedLongitude,
        is_completed: isCompleted,
        updated_at: new Date(),
      };

      let profile;

      if (profileExists) {
        profile = await tx.profiles.update({
          where: { user_id: session.id },
          data: profileData,
        });
      } else {
        profile = await tx.profiles.create({
          data: {
            user_id: session.id,
            ...profileData,
          },
        });
      }

      const updatedUser = await tx.users.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      return {
        user: updatedUser,
        profile,
      };
    });

    return NextResponse.json({
      message: "Profile berhasil diperbarui.",
      user: {
        id: result.user?.id,
        username: result.user?.username,
        email: result.user?.email,
        role: result.user?.role,
      },
      profile: {
        fullname: result.profile.fullname,
        phone: result.profile.phone,
        bio: result.profile.bio,
        gender: result.profile.gender ?? "",
        birthDate:
          result.profile.birth_date?.toISOString().split("T")[0] ?? "",
        avatarUrl: result.profile.avatar_url,
        avatarPublicId: result.profile.avatar_public_id,
        province: result.profile.province,
        regency: result.profile.regency,
        district: result.profile.district,
        village: result.profile.village,
        detailAddress: result.profile.detail_address,
        latitude: toNumber(result.profile.latitude),
        longitude: toNumber(result.profile.longitude),
        isCompleted: result.profile.is_completed,
      },
    });
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      { message: error.message ?? "Gagal memperbarui profile." },
      { status: 500 }
    );
  }
}