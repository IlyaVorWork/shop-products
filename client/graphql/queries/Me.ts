import { gql } from '@apollo/client'

const ME = gql`
  query {
    me {
      id
      username
      email
      confirmed
    }
  }
`

export default ME
