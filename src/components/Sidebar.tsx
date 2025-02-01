'use client'

// import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="lg:w-80 bg-zinc-900 rounded-xl p-6 h-fit">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {/* <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B5F91C063-794D-4551-ADE9-4D28C6BB548C%7D-u4WjgqTSVlJmlcSiWAev71XJm6G3j0.png"
            alt="Profile"
            width={100}
            height={100}
            className="rounded-2xl object-cover"
          /> */}
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
        </div>
        <h1 className="mt-4 text-2xl font-bold">John Doe</h1>
        <p className="text-zinc-400 mt-1">Full Stack Developer</p>

        <div className="mt-6 space-y-4 w-full">
          <div className="flex items-center gap-3 text-zinc-400">
            <Mail className="w-5 h-5" />
            <span className="text-sm">john.doe@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <Phone className="w-5 h-5" />
            <span className="text-sm">+1 234 567 890</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <MapPin className="w-5 h-5" />
            <span className="text-sm">San Francisco, USA</span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </Link>
          <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </aside>
  )
}