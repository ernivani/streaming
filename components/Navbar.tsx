import NavbarItem from "./Navbaritem";
import MobileMenu from "./MobileMenu";
import AccountMenu from "./AccountMenu";

import { BsBell, BsChevronDown, BsSearch } from "react-icons/bs";

import { useCallback, useEffect, useState } from "react";

const TOP_OFFSET = 66;

const Navbar = () => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const [showBackground, setShowBackground] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowBackground(window.scrollY >= TOP_OFFSET);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const toggleMobileMenu = useCallback(() => {
		setShowMobileMenu((current) => !current);
	}, []);

	const toggleAccountMenu = useCallback(() => {
		setShowAccountMenu((current) => !current);
	}, []);

	return (
		<nav className="w-full fixed z-40">
			<div
				className={`
                px-4
                md:px-12
                py-6
                flex
                flex-row
                items-center
                transition
                duration-500
                ${
					showBackground
						? "bg-zinc-900 bg-opacity-90"
						: "bg-transparent"
				}
               
            `}
			>
				<img className="h-4 lg:h-7" src="/images/logo.png" alt="Logo" />
				<div className="flex-row ml-8 gap-7 hidden lg:flex">
					<NavbarItem label="Home" />
					<NavbarItem label="TV Shows" />
					<NavbarItem label="Movies" />
					<NavbarItem label="Latest" />
					<NavbarItem label="My List" />
					<NavbarItem label="Browse by language" />
				</div>
				<div
					onClick={toggleMobileMenu}
					className="lg:hidden flex flex-row items-center ml-8 gap-2 cursor-pointer relative"
				>
					<p className="text-white text-sm">Browse</p>
					<BsChevronDown
						className={`text-white transition ${
							showMobileMenu ? "rotate-180" : ""
						}`}
					/>
					<MobileMenu visible={showMobileMenu} />
				</div>
				<div className="flex flex-row ml-auto gap-7 items-center">
					<div className="text-gray-200 hover:text-gray-400 cursor-pointer transition">
						<BsSearch />
					</div>
					<div className="text-gray-200 hover:text-gray-400 cursor-pointer transition">
						<BsBell />
					</div>
					<div
						onClick={toggleAccountMenu}
						className="flex flex-row items-center gap-2 cursor-pointer relative"
					>
						<div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
							<img src="/images/default-slate.png" alt="Avatar" />
						</div>
						<BsChevronDown
							className={`text-white transition ${
								showAccountMenu ? "rotate-180" : ""
							}`}
						/>
						<AccountMenu visible={showAccountMenu} />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
