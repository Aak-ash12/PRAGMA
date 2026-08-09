from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_auth_and_password_reset():
    test_email = "aakash.realuser@gmail.com"
    original_pw = "MySecretPass123"
    new_pw = "NewSecurePassword456"

    print("1. Registering real email account...")
    res = client.post("/api/v1/auth/register", json={
        "email": test_email,
        "password": original_pw,
        "name": "Aakash User",
        "role": "Government Officer"
    })
    print("Register Status:", res.status_code, res.json())
    assert res.status_code == 200

    print("2. Logging in with real email and original password...")
    res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": original_pw
    })
    print("Login Status:", res.status_code, res.json())
    assert res.status_code == 200

    print("3. Requesting Forgot Password Reset Email...")
    res = client.post("/api/v1/auth/forgot-password", json={
        "email": test_email
    })
    print("Forgot Password Status:", res.status_code)
    data = res.json()
    print("Reset response data:", data)
    assert res.status_code == 200
    token = data["reset_token"]
    assert token is not None

    print("4. Verifying Reset Token...")
    res = client.get(f"/api/v1/auth/verify-reset-token?token={token}")
    print("Verify Token Status:", res.status_code, res.json())
    assert res.status_code == 200

    print("5. Resetting Password with new password...")
    res = client.post("/api/v1/auth/reset-password", json={
        "token": token,
        "new_password": new_pw
    })
    print("Reset Password Status:", res.status_code, res.json())
    assert res.status_code == 200

    print("6. Logging in with NEW password...")
    res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": new_pw
    })
    print("New Login Status:", res.status_code, res.json())
    assert res.status_code == 200

    print("--- ALL AUTH AND PASSWORD RESET TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    test_full_auth_and_password_reset()
