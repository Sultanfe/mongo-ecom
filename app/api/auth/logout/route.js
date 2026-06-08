// JWT is stateless; logout is handled client-side by clearing localStorage.
// This endpoint exists so the client can call a single API and so we can
// later add server-side token blacklisting without changing call sites.
export async function POST() {
    return Response.json({ message: "Logout successful" }, { status: 200 });
}
