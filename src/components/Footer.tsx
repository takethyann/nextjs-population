import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div>© My nextjs population</div>
            </div>
        </footer>
    );
};

export default Footer;
