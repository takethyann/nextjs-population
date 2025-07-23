import styles from './Header.module.css';


const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <span className={styles.title}>人口構成分析</span>
                <nav>
                    <a href="#" className={styles.navLink}></a>
                </nav>
            </div>
        </header>
    );
}

export default Header;