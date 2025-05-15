import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Multiplayer Games",
	description: "Multiplayer made with WS",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
