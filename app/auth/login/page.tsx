"use client"

import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LoginPage() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D52D51]">
      <Card className="w-full max-w-sm border-[#D52D51]">
        <CardHeader className="items-center justify-center">
          <Avatar className="w-16 h-16 ml-8">
            <AvatarImage src="https://scontent.fcbb1-1.fna.fbcdn.net/v/t39.30808-6/457194139_537118228662786_4835914457282046923_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=6xfD_hvslxYQ7kNvwFXH65H&_nc_oc=AdnJuJvHFA4vjP2JFmGThikpKWUJWivppFsAQxRhGusKciOuxk01URxqMvRsJ7sHswOlPHpSNu1AJGC1BdQenfLX&_nc_zt=23&_nc_ht=scontent.fcbb1-1.fna&_nc_gid=qRctZiQmhxaaiGg_r46mpg&oh=00_AfgU7epzX_6pyH88txQnjWq-gjIb4KOsdbYCBgCdONgzVg&oe=692FFD5C" />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-[#3F51B5]" onClick={() => router.push("/dashboard/home")}>
              Iniciar sesión
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}