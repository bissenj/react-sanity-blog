import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client.js";
import BlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
    return builder.image(source);
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

    console.log('sanity client: ', sanityClient.clientConfig);

    return (
        <div>
            <div>
                <h2>{postData.title}</h2>
                <div>
                    <img
                        src={urlFor(postData.authorImage).width(100).url()}
                        alt="Author"
                    />
                    <h4>{postData.name}</h4>
                </div>
            </div>
            <img src={urlFor(postData.mainImage).width(200).url()} alt="" />
            <div>
                <BlockContent
                    blocks={postData.body}
                    projectId={sanityClient.projectId}
                    dataset={sanityClient.dataset}
                />
            </div>
        </div>
    );
}