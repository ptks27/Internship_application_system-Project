import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const {user} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null || user.role !== "agent") {
            navigate("/login");
        }
    },[user,navigate])

    return (
        <>
        {children}
        </>
    )
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;