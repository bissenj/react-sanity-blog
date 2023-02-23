import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import sanityClient from "../client.js";

export default function AllPosts() {
    const [allPostsData, setAllPosts] = useState(null);    
    

    useQuery("AllPosts", () => {
        getAllPosts();
    });

    /*
        In React 18, this is going to fire twice in Dev due to Strict Mode.  
    */
    useEffect(() => {           
    }, []);

    function getAllPosts() {
        sanityClient
            .fetch(
                `
                *[_type == "post"] {
                    title, 
                    slug,
                    mainImage {
                        asset-> {
                            _id,
                            url
                        }                        
                    }
                }`                
            )
            .then((data) => {
                setAllPosts(data);
                console.log('Data: ', data);
            })
            .catch(console.error);      
    }

    console.log('render');    

    return (
        <div className="bg-green100 min-h-screen p-12">
            <div className="container mx-auto">
                <h2 className="text-5xl flex justify-center cursive">Blog Posts</h2>
                <h3 className="text-lg text-gray-600 flex justify-center mb-12">
                    Welcome to my blog posts page!
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPostsData &&
                        allPostsData.map((post, index) => (
                            <Link to={"/" + post.slug.current} key={post.slug.current}>
                                <span 
                                    className="block h-64 relative rounded shadow leading-snug bg-white"
                                    key={index}
                                >
                                    <img
                                        className="w-full h-full rounded-r object-cover absolute" 
                                        src={post.mainImage.asset.url} 
                                        alt="" 
                                    />
                                    <span
                                        className="block relative h-full flex justify-end items-end pr-4 bh-4"
                                    >
                                        <h2
                                            className="text-gray-800 text-lg font-bold px-3 py-4 bg-red-700 text-red-100 bg-opacity-75 rounded"
                                        >
                                            {post.title}
                                        </h2>
                                    </span>
                                </span>
                            </Link>   
                        ))
                    }                
                </div>
            </div>            
        </div>
    );
}