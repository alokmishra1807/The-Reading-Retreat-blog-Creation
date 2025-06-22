
"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";

import {} from '@react-oauth/google';

import { GoogleOAuthProvider } from "@react-oauth/google";

export const user_service = "http://localhost:5000";
export const author_service = "http://localhost:5001";
export const blog_service = "http://localhost:5002";


export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  linkedin: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  author: string;
  category: string;
  created_at:string;
}

interface savedBlogType
{
    id:string;
    userid:string;
    blogid:string;
    created_at:string;
}
export const BlogCategory = [
  "Technology",
  "Health",
  "Finance",
  "Travel",
  "Food",
  "Education",
  "Entertainment",
  "Others",
];

interface AppContextTypes{
    user:User | null;
    loading:boolean;
    isAuth:boolean;
   setUser:React.Dispatch<React.SetStateAction<User|null>>
    
    setLoading:React.Dispatch<React.SetStateAction<boolean>>
     setIsAuth:React.Dispatch<React.SetStateAction<boolean>>
     logoutUser:()=>Promise<void>;
     blog:Blog[]| null;
     blogLoading: boolean;
     setSearchQuery:React.Dispatch<React.SetStateAction<string>>;
     searchQuery:string;
    setCategory:React.Dispatch<React.SetStateAction<string>>;
     fetchBlog: () => Promise<void>;
     savedBlog:savedBlogType[] | null;
     getSavedBlogs:()=>Promise<void>;
    }


const AppContext =createContext<AppContextTypes |undefined>(undefined);

interface AppProviderProps{
    children:ReactNode
}



export const AppProvider: React.FC<AppProviderProps> = ({children})=>{

    const [user, setUser] = useState<User|null>(null);

    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(false)

    const [blogLoading, setBlogLoading] = useState(false);

    async function fetchUser(){
try {
    const token = Cookies.get("token");
    const {data} = await axios.get(`${user_service}/api/v1/me`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    setUser(data);
    setIsAuth(true);
    setLoading(false);
} catch (error) {
    console.log(error);
    
}
    }

    const [blog, setBlog] = useState<Blog[]| null>(null);

const [category, setCategory] = useState("");

const [searchQuery, setSearchQuery] = useState("");




async function fetchBlog() {
    setBlogLoading(true);
    try {
        const {data} = await axios.get(`${blog_service}/api/v1/blogs/all?searchQuery=${searchQuery}&category=${category}`);
        setBlog(data);
    } catch (error) {
        console.log(error);
    }finally{
        setBlogLoading(false);
    }
}


const [savedBlog, setSavedBlog] = useState<savedBlogType[] |null>(null)



async function getSavedBlogs() {
    try {
        const token = Cookies.get("token");
        const {data} = await axios.get(`${blog_service}/api/v1/blog/saved/all`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setSavedBlog(data);
    } catch (error) {
        console.log(error);
    }
}

    async function logoutUser() {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
        toast.success("User Logged Out Successfully");
    }
useEffect(()=>{
    fetchUser();
    getSavedBlogs();
   
},[]);

useEffect(()=>{
    fetchBlog();
},[searchQuery,category])

    return <AppContext.Provider value={{user,
    setIsAuth,
    isAuth,
    loading,
    setLoading,
    setUser,logoutUser,
    blog,
    blogLoading,searchQuery,setSearchQuery,setCategory,
    fetchBlog,savedBlog,getSavedBlogs
    }}>
        <GoogleOAuthProvider clientId="138116539883-sg5212a8gmc4ebatt4prg7rgdt4fh2hj.apps.googleusercontent.com">
                {children}
        <Toaster/>
        </GoogleOAuthProvider>
    
        </AppContext.Provider>
}


export const useAppData =():AppContextTypes=>{
    const context = useContext(AppContext)
    if(!context){
        throw new Error("useappdata must be needed")
    }
    return context
    ;
}