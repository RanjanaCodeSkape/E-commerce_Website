import React from 'react'
import styles from './styles/style.module.css'

const HomePage = ({logout}) => {
  return (
    <div className={styles.HomeMainPage}>
     <div className={styles.HomeHeaderPage}>
     <h1>Homepage</h1>
     <button onClick={logout}>Logout</button>
     </div>
    </div>
  )
}

export default HomePage
