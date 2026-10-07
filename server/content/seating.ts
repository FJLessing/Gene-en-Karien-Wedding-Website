import type { SeatingTable } from "#shared/types/types";

// Seating chart (Figma node 199:67), rendered at /seating-chart. Names are shown
// exactly as the couple want them on the day, so they're shared by en.ts and
// af.ts rather than duplicated per locale. Spellings follow the couple's verified
// "Table placement" document — fix names here, nowhere else.
export const seatingTables: SeatingTable[] = [
	{ number: 1, guests: ["San-Marie", "Barry", "Anri", "Rachel", "Henning", "Nino", "Maryke", "Dina", "De Beer"] },
	{ number: 2, guests: ["Christina", "Freek", "Philip", "Melissa", "Melissa", "Johan", "Waldo", "Maretha", "Marinus", "Doney"] },
	{ number: 3, guests: ["Werner R", "Elge", "Werner W", "Chantelle", "Skinner", "Dylan", "Sankia", "Dewald", "Jaco", "Jani"] },
	{ number: 4, guests: ["Karolien", "Barry", "Niel", "Jeannere", "Gerhard", "Laura", "Albert", "Andrea", "Luvan"] },
	{ number: 5, guests: ["Pippa", "AD", "Jani", "Louis", "Cilly", "Philly", "Carla", "Bunge", "Leo-Marie", "Milan"] },
	{ number: 6, guests: ["Nina", "Tarquin", "Clara", "Hermann", "Nicole", "Michiel", "Monike", "Roux", "Michelle", "Johann"] },
	{ number: 7, guests: ["Gene", "Karien", "Elbert", "Maryn", "Juan", "Marla", "Estie", "Pieter", "Simone", "Gideon", "Marnus", "Susan"] },
	{ number: 8, guests: ["Ian", "Annemie", "Leon", "Sigourney", "Tyron", "Lerissa", "Marcel", "Jonathan", "Ockie", "George"] },
	{ number: 9, guests: ["Ilze", "Rudi", "Candice", "Rob", "Inge", "FJ", "Francois", "Monica", "Maryke", "Janu"] },
	{ number: 10, guests: ["Jaci", "Dane", "Danie", "Rouxlene", "Herman (V)", "Ruark", "Telana", "Anneen", "Coenraad"] },
	{ number: 11, guests: ["Marietjie", "John", "Sonja", "Kobus", "Helena", "Jurie", "Manda", "Beatrix", "David"] },
	{ number: 12, guests: ["Elbert (Snr)", "Loise", "Louis", "Magda", "Jo", "Elmarie", "Chaim", "Elize", "Madeleine", "Janine"] },
	{ number: 13, guests: ["Christina", "George", "Adriaan", "Elizabeth", "Arno", "Shona", "Petra", "Fernando", "Steven", "Lettie"] },
];
