import React, { useState } from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import Layout from "../layout/layout"
import showdown from "showdown"

const converter = new showdown.Converter()


class CategoryTree extends React.Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            allSchemaYaml(filter: {tag: {eq: "categories"}}) {
              edges {
                node {
                  tag
                  description
                  valid_values {
                    group
                    values
                  }
                }
              }
            }
            allMdx (
              filter: {
                frontmatter: { 
                  title: { ne: "" }
                  innav: { eq: true}
                }
                fields: { slug: { regex: "/^((?!changelog).)*$/" } }
              }
              sort: {fields: fileInfo___relativePath, order: ASC}
            ) {
              edges {
                node {
                  fileInfo {
                    relativePath
                    sourceInstanceName
                    id
                  }
                  frontmatter {
                    title
                    subtitle
                    categories
                  }
                  fields {
                    slug
                  }
                }
              }
            }
                    }
        `}
        render={data => {
          const yamlfile = data.allSchemaYaml.edges
          const pages = data.allMdx.edges

          return (
            <Layout>
              <h1>Category Tree</h1>
                  {yamlfile.map((heading, i) => {
                    return(
                        <ul>
                        {heading.node.valid_values.map((groups, i) => {
                            return (
                              <li key={i}>
                                {groups.group}
                                  <ul>
                                    {groups.values.map((value, i) => {
                                        return (
                                          <li key={i}>
                                            {value}
                                            <ul>
                                            {pages.filter(page => {
                                              const categories = page.node.frontmatter.categories
                                              return (
                                                categories.indexOf(value) >= 0
                                              )
                                              })
                                              .map((page) => {
                                                return (
                                                  <li>
                                                  {page.node.frontmatter.title}
                                                  : {page.node.frontmatter.subtitle}
                                                  </li>
                                                )
                                              })
                                            }

                                            </ul>
                                          </li>
                                        )
                                      })}
                                  </ul>
                              </li>
                            )
                          })
                        }
                        </ul>
                    )
                  })}
            </Layout>
          )
        }}
      />
    )
  }
}

export default CategoryTree

/* .filter(doc => {
                return doc.title.indexOf(search) >= 0
              })*/