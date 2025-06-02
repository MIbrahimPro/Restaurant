import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    BiUser,
    BiCart,
} from "react-icons/bi";
import { useAuth } from "../context/AuthContext";

// Import react-bootstrap components
import NavbarBs from 'react-bootstrap/Navbar'; // Renamed to avoid conflict with HTML tag
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <NavbarBs expand="md" variant="dark" sticky="top" className="navbar-solid">
            <Container>
                {/* Logo */}
                <NavbarBs.Brand
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                    className="mb-0 h1 font-heading"
                >
                    Restaurant
                </NavbarBs.Brand>

                {/* Toggler */}
                <NavbarBs.Toggle aria-controls="navbarNav" />

                {/* Links */}
                <NavbarBs.Collapse id="navbarNav">
                    <Nav className="mx-auto">
                        <Nav.Link
                            as={NavLink} // Use NavLink from react-router-dom for routing
                            to="/"
                            style={({ isActive }) => ({
                                color: isActive ? "#ffbe33" : "#fff",
                            })}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/menu"
                            style={({ isActive }) => ({
                                color: isActive ? "#ffbe33" : "#fff",
                            })}
                        >
                            Menu
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/about"
                            style={({ isActive }) => ({
                                color: isActive ? "#ffbe33" : "#fff",
                            })}
                        >
                            About
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/reviews"
                            style={({ isActive }) => ({
                                color: isActive ? "#ffbe33" : "#fff",
                            })}
                        >
                            Reviews
                        </Nav.Link>

                        {/* If admin, show Admin dropdown */}
                        {user && user.role === "admin" && (
                            <NavDropdown
                                title="Admin"
                                id="adminDropdown"
                                menuVariant="dark" // For dark dropdown menu
                            >
                                <NavDropdown.Item as={NavLink} to="/admin">
                                    Dashboard
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/admin/categories">
                                    Manage Categories
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/admin/items">
                                    Manage Items
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/admin/orders">
                                    Manage Orders
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/admin/users">
                                    Manage Users
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/admin/general">
                                    General Info
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>

                    {/* Icons: Profile/Cart/Login/Logout */}
                    <Nav className="d-flex align-items-center">
                        <Nav.Link onClick={() => navigate("/profile")}>
                            <BiUser
                                size={24}
                                color="#fff"
                                style={{ cursor: "pointer" }}
                                title="Profile"
                            />
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate("/cart")}>
                            <BiCart
                                size={24}
                                color="#fff"
                                style={{ cursor: "pointer" }}
                                title="Cart"
                            />
                        </Nav.Link>
                    </Nav>
                </NavbarBs.Collapse>
            </Container>
        </NavbarBs>
    );
};

export default Navbar;