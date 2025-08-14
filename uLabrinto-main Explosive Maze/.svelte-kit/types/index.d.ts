type DynamicRoutes = {
	
};

type Layouts = {
	"/": undefined;
	"/jogar": undefined;
	"/sobre": undefined
};

export type RouteId = "/" | "/jogar" | "/sobre";

export type RouteParams<T extends RouteId> = T extends keyof DynamicRoutes ? DynamicRoutes[T] : Record<string, never>;

export type LayoutParams<T extends RouteId> = Layouts[T] | Record<string, never>;

export type Pathname = "/" | "/jogar" | "/sobre";

export type ResolvedPathname = `${"" | `/${string}`}${Pathname}`;

export type Asset = "/favicon.png" | "/images/Bomb_pixel.svg" | "/images/Logo.png" | "/images/bau.png" | "/images/bomberman.png" | "/images/grama.png" | "/images/logoIFPE.png" | "/images/men.png" | "/images/parede.jpg";