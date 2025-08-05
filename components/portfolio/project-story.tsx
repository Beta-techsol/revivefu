import { Quote } from "lucide-react"

interface ProjectStoryProps {
  story: {
    title: string
    description: string
    highlights: string[]
    quote?: string
  }
}

export default function ProjectStory({ story }: ProjectStoryProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Story Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 font-urbanist">{story.title}</h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed">
                  <p>{story.description}</p>
                </div>
              </div>

              {/* Quote Section */}
              {story.quote && (
                <div className="relative bg-amber-50 p-8 rounded-2xl border-l-4 border-amber-500">
                  <Quote className="absolute top-4 left-4 w-8 h-8 text-amber-500 opacity-50" />
                  <blockquote className="text-xl text-gray-800 font-medium italic pl-12">"{story.quote}"</blockquote>
                </div>
              )}
            </div>

            {/* Highlights Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-2xl sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-urbanist">Key Highlights</h3>
                <ul className="space-y-4">
                  {story.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span className="text-gray-700 leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
