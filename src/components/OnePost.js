import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client.js";
import BlockContent from "@sanity/block-content-to-react";
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
    return builder.image(source);
}


const ptComponents = {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) {
          return null
        }
        return (
          <img
            alt={value.alt || ' '}
            loading="lazy"
            //src={urlFor(value).width(320).height(240).fit('max').auto('format')}
            src={urlFor(value).fit('max').auto('format')}
          />
        )
      }
    }
}  
  


export default function OnePost() {
    const [postData, setPostData] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        sanityClient
            .fetch(
                `*[slug.current == $slug] {
                    title,
                    slug,
                    mainImage{
                        asset->{
                            _id,
                            url
                        }
                    },
                    body,
                    "name": author->name,
                    "authorImage": author->image
                }`,
                { slug }
            )
            .then((data) => {
                console.log('Data: ', data);
                setPostData(data[0]);
            }
            )
            .catch((ex) => console.error('Error caught in OnePost: ', ex.message));
    }, [slug]);

    if (!postData) return <div>Loading...</div>

    //console.log('sanity client: ', sanityClient);

    return (
        <div className="bg-gray-200 min-h-screen p-12">
            <div className="container shadow-lg mx-auto bg-green-100 rounded-lg">

                {/* POST TITLE, IMAGE, AUTHOR */}
                <div className="relative">
                    <div className="absolute h-full w-full flex items-center justify-center p-8">
                       
                        <div className="bg-white bg-opacity-75 rounded p-12">

                            {/* TITLE */}
                            <h2 className="cursive text-3xl lg:text-6xl mb-4">
                                {postData.title}
                            </h2>

                            {/* AUTHOR */}
                            <div className="flex justify-center text-gray-800">
                                <img
                                    src={urlFor(postData.authorImage).url()}
                                    className="w-10 h-10 rounded-full"
                                    alt="Author is Kap"
                                />
                                <h4 className="cursive flex items-center pl-2 text-2xl">
                                    {postData.name}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* MAIN POST IMAGE */}
                    <img
                        className="w-full object-cover rounded-t"
                        src={urlFor(postData.mainImage).url()}
                        alt=""
                        style={{ height: "400px" }}
                    />
                </div>

                {/* POST CONTENT */}
                <div className="px-16 lg:px-48 py-12 lg:py-20 prose lg:prose-xl max-w-full">
                    {/* <BlockContent
                        blocks={postData.body}
                        projectId={sanityClient.projectId}
                        dataset={sanityClient.dataset}
                        components={ptComponents}
                    /> */}                    
                    <PortableText 
                        value={postData.body} 
                        components={ptComponents}
                    />
                </div>
            </div>
        </div>
    );
}