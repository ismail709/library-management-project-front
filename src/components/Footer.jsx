import { Link } from "react-router";


export default function Footer(){
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand Section */}
                <div>
                    <h2 className="text-2xl font-semibold">Books Paradise</h2>
                    <p className="mt-2 text-gray-400">
                        Your gateway to a world of stories. Rent, read, and explore unlimited books.
                    </p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="text-gray-400 hover:text-white">Browse Books</Link></li>
                        <li><Link to="/c" className="text-gray-400 hover:text-white">Browse Categories</Link></li>
                        <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                        <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                        <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                {/* Social Media & Contact */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">📘 Facebook</a>
                        <a href="#" className="text-gray-400 hover:text-white">🐦 Twitter</a>
                        <a href="#" className="text-gray-400 hover:text-white">📸 Instagram</a>
                    </div>
                    <p className="mt-4 text-gray-400">📧 support@booksparadise.com</p>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 mt-6 border-t border-gray-700 pt-4">
                © {new Date().getFullYear()} Books Paradise. All rights reserved.
            </div>
        </footer>
    );
}