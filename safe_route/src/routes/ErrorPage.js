import { Link } from "react-router-dom";
import classes from "./ErrorPage.module.css";

function ErrorPage() {
    return (
        <div className={classes.mainContainer}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <Link to="/" className={classes.link}>
                Go back to Home Page
            </Link>
        </div>
    );
}

export default ErrorPage;
