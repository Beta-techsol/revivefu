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
        link: "/category/office-chairs",
        children: [
          { name: "Executive Chairs", link: "/category/executive-chairs" },
          { name: "Staff Chairs", link: "/category/manager-chairs" },
          { name: "Visitor Chairs", link: "/category/staff-chairs" },
          { name: "Manager Chairs", link: "/category/staff-chairs" },
        ],
      },
      {
        name: "Office Tables",
        link: "/category/office-tables",
        children: [
          { name: "Executive Tables", link: "/category/executive-tables" },
          { name: "Manager Tables", link: "/category/manager-tables" },
          { name: "Manager Tables", link: "/category/executive-tables" },
          { name: "Staff Tables", link: "/category/manager-tables" },
          { name: "WorkStations", link: "/category/manager-tables" },
          { name: "Meeting Tables", link: "/category/manager-tables" },
          { name: "Reception Desk", link: "/category/manager-tables" },
        ],
      },
       { name: "Storage", 
      link: "/category/storage" ,
       children: [
      { name: "Drawer Pedestals", link: "/category/office-sofa-stools" },
      { name: "Filing Cabinets", link: "/category/office-decor" },
      ],
      },
      { name: "Office Sofa & Stools", link: "/category/storage" },
      { name: "Office Decor", link: "/category/office-sofa-stools" },
    ],
  },
  {
    name: "Home Furniture",
    image: "/showcase/Home Furniture.webp",
    subcategories: [
      { name: "Beds", link: "/category/beds" },
      { name: "Sofas", link: "/category/dressers" },
      { name: "Settees & Banches", link: "/category/nightstands" },
      { name: "Center Tables", link: "/category/wardrobes" },
      { name: "Side Tables", link: "/category/mattresses" },
      { name: "Nesting Tables", link: "/category/beds" },
      { name: "Dinning Sets", link: "/category/dressers" },
      { name: "Dinning Chairs", link: "/category/nightstands" },
      { name: "Tea Trolley", link: "/category/wardrobes" },
      { name: "Barstools", link: "/category/mattresses" },
      { name: "Casual Chairs", link: "/category/mattresses" },
    ],
  },
  {
    name: "Gaming Furniture",
    image: "/showcase/gaming.jfif",
    subcategories: [
      { name: "Gaming Chairs", link: "/category/office-chairs" },
      { name: "Gaming Tables", link: "/category/desks" },
      ],
  },
  {
    name: "Study | Home Office",
    image: "/showcase/study.webp",
    subcategories: [
      { name: "Computer | Study Table", link: "/category/patio-sets" },
      { name: "Computer | Study Chair", link: "/category/outdoor-sofas" },
    ],
  },
]

// 🔹 Collapsible Item Component
function SubCategoryItem({ item }: { item: SubCategory }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  return (
    <li className="text-sm font-poppins">
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
              href="/sale"
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-300"
            >
              Shop Sale Items
            </Link>
            <Link
              href="/new-arrivals"
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
