const API_BASE_URL = "http://localhost:8081"; // backend чинь

const jsonHeaders = {
    "Content-Type": "application/json",
};

export async function login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ username, password }),
        credentials: "include", // cookie авахын тулд
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || "Нэвтрэлт амжилтгүй.");
    }

    // Хэрэв 2FA хэрэгтэй бол
    if (data?.mfaRequired) {
        return { mfaRequired: true, txId: data.txId };
    }

    // Амжилттай login болсон тохиолдолд → redirect after-login
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get("return_url") || "http://localhost:4000/callback";

    // SSO service-д redirect хийж ticket үүсгүүлэх
    window.location.href = `${API_BASE_URL}/auth/after-login?return_url=${encodeURIComponent(returnUrl)}`;

    return { ok: true }; // onSuccess дуудагдахаас өмнө redirect болно
}

export async function verifyOtp(txId, otp) {
    const res = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ txId, otp }),
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || "OTP баталгаажуулалт амжилтгүй.");
    }

    return { ok: true };
}

export async function logout() {
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
}

export async function getProfile() {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Профайл авахад алдаа гарлаа.");
    }
    return res.json();
}
