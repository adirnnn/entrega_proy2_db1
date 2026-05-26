export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: string;
    token: string;
}

export interface AuthResult {
    success: boolean;
    user?: AuthUser;
    error?: string;
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResult> {
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                user: {
                    id: data.user.id,
                    email: credentials.email,
                    name: data.user.name,
                    role: data.user.role,
                    token: data.token,
                },
            };
        } else {
            return {
                success: false,
                error: data.message || "Correo o contraseña incorrectos.",
            };
        }
    } catch (err) {
        return {
            success: false,
            error: "Error de conexión con el servidor.",
        };
    }
}
