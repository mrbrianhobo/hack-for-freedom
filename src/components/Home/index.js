import React from 'react'
import styled from 'styled-components'
import Nav from '../Nav'
import QuestSection from '../QuestSection'
// import useMedia from 'use-media'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

// const LeftWrapper = styled.div`
//   height: 100%;
//   width: 360px;
//   padding-left: 32px;
//   padding-right: 32px;
//   border-right: 1px solid rgba(255, 255, 255, 0.16);
// `

export default function Home() {
  // const isSmall = useMedia({ maxWidth: '940px' })
  return (
    <Wrapper>
      <Nav />
      <QuestSection />
    </Wrapper>
  )
}
