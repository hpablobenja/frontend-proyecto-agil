"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api, { setAuthToken } from "@/lib/api";
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setAuthToken(data.token);
        toast.success(`¡Bienvenido ${data.user.username}!`, {
        duration: 4000,
        icon: "👋",
      });
      router.push("/dashboard/home");
    } catch (error: any) {
        console.error("Login error:", error);
        toast.error(
          error.message || "Usuario o contraseña incorrectos",
          { duration: 4000 }
        )}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFDEDE]">
      <Card className="w-full max-w-sm border-[#D52D51]">
        <CardHeader className="flex flex-col items-center justify-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://scontent.fcbb1-1.fna.fbcdn.net/v/t39.30808-6/457194139_537118228662786_4835914457282046923_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=6xfD_hvslxYQ7kNvwFXH65H&_nc_oc=AdnJuJvHFA4vjP2JFmGThikpKWUJWivppFsAQxRhGusKciOuxk01URxqMvRsJ7sHswOlPHpSNu1AJGC1BdQenfLX&_nc_zt=23&_nc_ht=scontent.fcbb1-1.fna&_nc_gid=qRctZiQmhxaaiGg_r46mpg&oh=00_AfgU7epzX_6pyH88txQnjWq-gjIb4KOsdbYCBgCdONgzVg&oe=692FFD5C" />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#3F51B5]" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}