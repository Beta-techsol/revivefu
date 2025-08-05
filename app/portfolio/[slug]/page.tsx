import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/portfolio-data"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import ProjectHero from "@/components/portfolio/project-hero"
import ProjectOverview from "@/components/portfolio/project-overview"
import ProjectGallery from "@/components/portfolio/project-gallery"
import ProjectStory from "@/components/portfolio/project-story"
import ProjectCTA from "@/components/portfolio/project-cta"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | Revive Furniture Portfolio`,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: [project.heroImage],
    },
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: project.title },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumb items={breadcrumbItems} />

        <Link
          href="/portfolio"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Link>
      </div>

      {/* Hero Section */}
      <ProjectHero title={project.title} subtitle={project.subtitle} heroImages={project.heroImages} />

      {/* Project Overview */}
      <ProjectOverview project={project} />

      {/* Image Gallery */}
      <ProjectGallery images={project.gallery} projectTitle={project.title} />

      {/* Project Story */}
      <ProjectStory story={project.story} />

      {/* Call to Action */}
      <ProjectCTA />
    </div>
  )
}
