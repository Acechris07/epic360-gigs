import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"

type Gig = {
  id: string
  title: string
  description: string
  price: number
  delivery_time: number
  category: string
  tags: string[] | null
  images: string[] | null
  freelancer: {
    full_name: string
    avatar_url: string | null
  }
}

export function GigCard({ gig }: { gig: Gig }) {
  return (
    <Link href={`/gigs/${gig.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-100 hover:border-green-200">
        <div className="aspect-video relative">
          <Image
            src={gig.images?.[0] || "/placeholder.svg?height=200&width=300"}
            alt={gig.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Image
              src={gig.freelancer.avatar_url || "/placeholder.svg?height=24&width=24"}
              alt={gig.freelancer.full_name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">{gig.freelancer.full_name}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{gig.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {gig.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-green-100 text-green-800">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.9 (127)</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{gig.delivery_time} days</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="w-full flex justify-between items-center">
            <Badge variant="outline" className="border-green-200 text-green-700">
              {gig.category}
            </Badge>
            <span className="text-lg font-bold text-green-600">${gig.price}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
