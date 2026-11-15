"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronRight } from "lucide-react"

interface MegaMenuProps {
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

interface SubCategory {
  name: string
  link?: string
  children?: SubCategory[]
}

const categories = [
  {
    name: "Office Furniture",
    image: "/showcase/Office Furniture.jpg",
    subcategories: [
      {
        name: "Office Chairs",
        link: "/shop?categories=Office+Chairs",
        children: [
          { name: "Executive Chairs", link: "/shop?search=executive%20chair" },
          { name: "Staff Chairs", link: "/shop?search=staff%20chair" },
          { name: "Visitor Chairs", link: "/shop?search=visitor%20chair" },
          { name: "Manager Chairs", link: "/shop?search=manager%20chair" },
        ],
      },
      {
        name: "Office Tables",
        link: "/shop?categories=Office+Tables",
        children: [
          { name: "Executive Tables", link: "/shop?search=executive%20table" },
          { name: "Manager Tables", link: "/shop?search=manager%20table" },
          { name: "Staff Tables", link: "/shop?categories=Staff+Table" },
          { name: "WorkStations", link: "/shop?search=workstations" },
          { name: "Meeting Tables", link: "/shop?search=meeting%20table" },
          { name: "Reception Desk", link: "/shop?search=reception%20desk" },
        ],
      },
      { 
        name: "Storage", 
        link: "/shop?categories=Storage",
        children: [
          { name: "Drawer Pedestals", link: "/shop?search=drawer%20pedestals" },
          { name: "Filing Cabinets", link: "/shop?search=filing%20cabinets" },
        ],
      },
      { name: "Office Sofa", link: "/shop?search=office%20sofa%20" },
      { name: "Office Decor", link: "/shop?search=office%20decor" },
    ],
  },
  {
    name: "Home Furniture",
    image: "/showcase/Home Furniture.webp",
    subcategories: [
      { name: "Beds", link: "/shop?search=bed" },
      { name: "Sofas", link: "/shop?search=sofa" },
      { name: "Center Tables", link: "/shop?search=center%20table" },
      { name: "Dinning Sets", link: "/shop?search=dining%20set" },
      { name: "Dinning Chairs", link: "/shop?search=dining%20chair" },
      { name: "Barstools", link: "/shop?search=barstool" },
      { name: "Chairs", link: "/shop?search=chairs" },
    ],
  },
  {
    name: "Gaming Furniture",
    image: "/showcase/gaming.jfif",
    subcategories: [
      { name: "Gaming Chairs", link: "/shop?search=gaming" },
      { name: "Gaming Tables", link: "/shop?search=gaming-table" },
    ],
  },
  {
    name: "Study | Home Office",
    image: "/showcase/study.webp",
    subcategories: [
      { name: "Computer | Study Table", link: "/shop?search=study%20table" },
      { name: "Computer | Study Chair", link: "/shop?search=study%20chair" },
    ],
  },
]

// 🔹 Collapsible Item Component
function SubCategoryItem({ item }: { item: SubCategory }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  return (
    <li className="text-base font-poppins">
      <div className="flex items-center justify-between">
        <Link
          href={item.link || "#"}
          className="text-gray-600 hover:text-[#C53D39] transition-colors duration-200"
        >
          {item.name}
        </Link>

        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="ml-2 text-gray-500 hover:text-[#C53D39] transition"
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul className="mt-2 ml-4 pl-2 border-l border-gray-200 space-y-2">
          {item.children!.map((child) => (
            <SubCategoryItem key={child.name} item={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

// 🔹 Recursive List Component
function SubCategoryList({ items, twoColumn = false }: { items: SubCategory[], twoColumn?: boolean }) {
  return (
    <ul className={twoColumn ? "grid grid-cols-2 gap-x-6 gap-y-2" : "space-y-2"}>
      {items.map((item) => (
        <SubCategoryItem key={item.name} item={item} />
      ))}
    </ul>
  )
}

// 🔹 Main MegaMenu
export function MegaMenu({ isVisible, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <div
      className={`mega-menu ${isVisible ? "show" : ""} absolute top-full left-0 w-full bg-white border-t-4 border-[#C53D39] z-50`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="space-y-4">
              <div className="relative overflow-hidden rounded-lg group">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <h3 className="absolute bottom-2 left-2 text-white font-bold text-lg font-poppins">
                  {category.name}
                </h3>
              </div>

              {category.subcategories && (
                <SubCategoryList 
                  items={category.subcategories} 
                  twoColumn={category.name === "Home Furniture"} 
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center space-x-8">
            <Link
              href="/shop"
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-300"
            >
              Shop Sale Items
            </Link>
            <Link
              href="/shop"
              className="border-2 border-[#C53D39] text-[#C53D39] px-6 py-2 rounded-full font-semibold hover:bg-[#C53D39] hover:text-white transition-all duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
