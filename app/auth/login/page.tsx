"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo.webp" alt="Revive Furniture" width={120} height={40} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Revive Furniture</h1>
            <p className="text-gray-600">Sign in to your account or create a new one</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Login Form */}
              <div className="p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Sign In
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Register Form */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Create Account</h2>

                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-white/90">
                          First Name
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="First name"
                            className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-white/90">
                          Last Name
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Last name"
                            className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="registerEmail" className="text-sm font-medium text-white/90">
                        Email Address
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <Input
                          id="registerEmail"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-white/90">
                        Phone Number
                      </Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone"
                          className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="registerPassword" className="text-sm font-medium text-white/90">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <Input
                          id="registerPassword"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Create password"
                          className="pl-10 pr-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white focus:ring-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                        >
                          {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-white/10 text-white focus:ring-white"
                      />
                      <span className="ml-2 text-sm text-white/90">
                        I agree to the{" "}
                        <Link href="/terms" className="underline hover:no-underline">
                          Terms & Conditions
                        </Link>
                      </span>
                    </div>

                    <Button className="w-full h-12 bg-white text-orange-600 hover:bg-gray-50 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Create Account
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-white/90">
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-white font-medium underline hover:no-underline"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
