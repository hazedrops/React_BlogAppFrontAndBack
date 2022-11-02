// ex: localhost:3000/articles/learn-node
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios'

import articles from './article-content'
import NotFoundPage from './NotFoundPage'
import CommentsList from "../components/CommentsList"

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] })
  const { articleId } = useParams()

  const addUpvote = async () => {
    const response = await axios.put(`/api/articles/${articleId}/upvote`);
  }

  useEffect(() => {
    const loadArticleInfo = async () => {
      // const response = await axios.get(`http://localhost:8000/api/articles/${articleId}`)
      // With the proxy set up we don't need the 'http://...' part
      const response = await axios.get(
        `/api/articles/${articleId}`
      )

      const newArticleInfo = response.data 
  
      setArticleInfo(newArticleInfo)
    }

    loadArticleInfo()
  }, [])

  const article = articles.find((article) => article.name === articleId)

  if (!article) {
    return <NotFoundPage />
  }

  return (
    <>
      <h1>{article.title}</h1>
      <p>This article has {articleInfo.upvotes} upvote(s)</p>
      {article.content.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
      <CommentsList comments={articleInfo.comments} />
    </>
  )
}

export default ArticlePage
