import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Plus, Minus, Trophy, RotateCcw, Sparkles, Star, Users, Flame, Hash, Pencil, ArrowRight, X, Search, Download, Share, Languages, Cloud, CloudOff, Copy, Link2, Loader2, RefreshCw } from 'lucide-react';
import { FLAGS } from './flags-data.js';

// =========================
// FLAG ICON — renders an inline SVG flag if available, falls back to
// the emoji on systems / for codes we don't have a SVG for. Works on
// Windows where flag emojis aren't supported.
// =========================
function FlagIcon({ code, fallback, className = '' }) {
  const src = code && FLAGS[code];
  if (src) {
    return <img src={src} alt="" className={className} draggable={false} />;
  }
  if (fallback) return <span className={className}>{fallback}</span>;
  return null;
}


// =========================
// DATA
// =========================
const TEAMS_BY_GROUP = {
  A: [
    { code: 'MEX', name: 'México',         flag: '🇲🇽', color: '#006847', page: 8  },
    { code: 'RSA', name: 'Sudáfrica',      flag: '🇿🇦', color: '#007A4D', page: 10 },
    { code: 'KOR', name: 'Corea del Sur',  flag: '🇰🇷', color: '#0F2A6E', page: 12 },
    { code: 'CZE', name: 'Chequia',        flag: '🇨🇿', color: '#11457E', page: 14 },
  ],
  B: [
    { code: 'CAN', name: 'Canadá',         flag: '🇨🇦', color: '#D52B1E', page: 16 },
    { code: 'BIH', name: 'Bosnia y Herz.', flag: '🇧🇦', color: '#002F6C', page: 18 },
    { code: 'QAT', name: 'Catar',          flag: '🇶🇦', color: '#8D1B3D', page: 20 },
    { code: 'SUI', name: 'Suiza',          flag: '🇨🇭', color: '#DA291C', page: 22 },
  ],
  C: [
    { code: 'BRA', name: 'Brasil',         flag: '🇧🇷', color: '#FFCC29', page: 24 },
    { code: 'MAR', name: 'Marruecos',      flag: '🇲🇦', color: '#C1272D', page: 26 },
    { code: 'HAI', name: 'Haití',          flag: '🇭🇹', color: '#00209F', page: 28 },
    { code: 'SCO', name: 'Escocia',        flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#0065BD', page: 30 },
  ],
  D: [
    { code: 'USA', name: 'EE.UU.',         flag: '🇺🇸', color: '#1B2C5C', page: 32 },
    { code: 'PAR', name: 'Paraguay',       flag: '🇵🇾', color: '#D52B1E', page: 34 },
    { code: 'AUS', name: 'Australia',      flag: '🇦🇺', color: '#FFCD00', page: 36 },
    { code: 'TUR', name: 'Turquía',        flag: '🇹🇷', color: '#E30A17', page: 38 },
  ],
  E: [
    { code: 'GER', name: 'Alemania',        flag: '🇩🇪', color: '#1A1A1A', page: 40 },
    { code: 'CUW', name: 'Curazao',         flag: '🇨🇼', color: '#012A87', page: 42 },
    { code: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮', color: '#FF8200', page: 44 },
    { code: 'ECU', name: 'Ecuador',         flag: '🇪🇨', color: '#FFD100', page: 46 },
  ],
  F: [
    { code: 'NED', name: 'Países Bajos',   flag: '🇳🇱', color: '#FF6900', page: 48 },
    { code: 'JPN', name: 'Japón',          flag: '🇯🇵', color: '#BC002D', page: 50 },
    { code: 'SWE', name: 'Suecia',         flag: '🇸🇪', color: '#006AA7', page: 52 },
    { code: 'TUN', name: 'Túnez',          flag: '🇹🇳', color: '#E70013', page: 54 },
  ],
  G: [
    { code: 'BEL', name: 'Bélgica',        flag: '🇧🇪', color: '#1A1A1A', page: 56 },
    { code: 'EGY', name: 'Egipto',         flag: '🇪🇬', color: '#CE1126', page: 58 },
    { code: 'IRN', name: 'Irán',           flag: '🇮🇷', color: '#239F40', page: 60 },
    { code: 'NZL', name: 'Nueva Zelanda',  flag: '🇳🇿', color: '#222222', page: 62 },
  ],
  H: [
    { code: 'ESP', name: 'España',         flag: '🇪🇸', color: '#AA151B', page: 66 },
    { code: 'CPV', name: 'Cabo Verde',     flag: '🇨🇻', color: '#003893', page: 68 },
    { code: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦', color: '#006C35', page: 70 },
    { code: 'URU', name: 'Uruguay',        flag: '🇺🇾', color: '#0038A8', page: 72 },
  ],
  I: [
    { code: 'FRA', name: 'Francia',        flag: '🇫🇷', color: '#0055A4', page: 74 },
    { code: 'SEN', name: 'Senegal',        flag: '🇸🇳', color: '#00853F', page: 76 },
    { code: 'IRQ', name: 'Irak',           flag: '🇮🇶', color: '#CE1126', page: 78 },
    { code: 'NOR', name: 'Noruega',        flag: '🇳🇴', color: '#BA0C2F', page: 80 },
  ],
  J: [
    { code: 'ARG', name: 'Argentina',      flag: '🇦🇷', color: '#74ACDF', page: 82 },
    { code: 'ALG', name: 'Argelia',        flag: '🇩🇿', color: '#006233', page: 84 },
    { code: 'AUT', name: 'Austria',        flag: '🇦🇹', color: '#ED2939', page: 86 },
    { code: 'JOR', name: 'Jordania',       flag: '🇯🇴', color: '#1A1A1A', page: 88 },
  ],
  K: [
    { code: 'POR', name: 'Portugal',       flag: '🇵🇹', color: '#046A38', page: 90 },
    { code: 'COD', name: 'RD Congo',       flag: '🇨🇩', color: '#007FFF', page: 92 },
    { code: 'UZB', name: 'Uzbekistán',     flag: '🇺🇿', color: '#0099B5', page: 94 },
    { code: 'COL', name: 'Colombia',       flag: '🇨🇴', color: '#FCD116', page: 96 },
  ],
  L: [
    { code: 'ENG', name: 'Inglaterra',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CE1124', page: 98  },
    { code: 'CRO', name: 'Croacia',        flag: '🇭🇷', color: '#171796', page: 100 },
    { code: 'GHA', name: 'Ghana',          flag: '🇬🇭', color: '#FCD116', page: 102 },
    { code: 'PAN', name: 'Panamá',         flag: '🇵🇦', color: '#005AA7', page: 104 },
  ],
};

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const DEFAULT_NAMES = {
  'ALG-2': 'Alexis Guendouz',
  'ALG-3': 'Ramy Bensebaini',
  'ALG-4': 'Youcef Atal',
  'ALG-5': 'Rayan Aït-Nouri',
  'ALG-6': 'Mohamed Amine Tougai',
  'ALG-7': 'Aïssa Mandi',
  'ALG-8': 'Ismael Bennacer',
  'ALG-9': 'Houssem Aquar',
  'ALG-10': 'Hicham Boudaoui',
  'ALG-11': 'Ramiz Zerrouki',
  'ALG-12': 'Nabil Bentalab',
  'ALG-14': 'Farés Chaibi',
  'ALG-15': 'Riyad Mahrez',
  'ALG-16': 'Said Benrahma',
  'ALG-17': 'Anis Hadj Moussa',
  'ALG-18': 'Amine Gouiri',
  'ALG-19': 'Baghdad Bounedjah',
  'ALG-20': 'Mohammed Amoura',
  'ARG-2': 'Emiliano Martinez',
  'ARG-3': 'Nahuel Molina',
  'ARG-4': 'Cristian Romero',
  'ARG-5': 'Nicolas Otamendi',
  'ARG-6': 'Nicolas Tagliafico',
  'ARG-7': 'Leonardo Balerdi',
  'ARG-8': 'Enzo Fernandez',
  'ARG-9': 'Alexis Mac Allister',
  'ARG-10': 'Rodrigo De Paul',
  'ARG-11': 'Exequiel Palacios',
  'ARG-12': 'Leandro Paredes',
  'ARG-14': 'Nico Paz',
  'ARG-15': 'Franco Mastantuono',
  'ARG-16': 'Nico Gonzalez',
  'ARG-17': 'Lionel Messi',
  'ARG-18': 'Lautaro Martinez',
  'ARG-19': 'Julian Alvarez',
  'ARG-20': 'Giuliano Simeone',
  'AUS-2': 'Mathew Ryan',
  'AUS-3': 'Joe Gauci',
  'AUS-4': 'Harry Souttar',
  'AUS-5': 'Alessandro Circati',
  'AUS-6': 'Jordan Bos',
  'AUS-7': 'Aziz Behich',
  'AUS-8': 'Cameron Burgess',
  'AUS-9': 'Lewis Miller',
  'AUS-10': 'Milos Degenek',
  'AUS-11': 'Jackson Irvine',
  'AUS-12': 'Riley McGree',
  'AUS-14': 'Aiden O\'Neill',
  'AUS-15': 'Connor Metcalfe',
  'AUS-16': 'Patrick Yazbek',
  'AUS-17': 'Craig Goodwin',
  'AUS-18': 'Kusini Vengi',
  'AUS-19': 'Nestory Irankunda',
  'AUS-20': 'Mohamed Touré',
  'AUT-2': 'Alexander Schlager',
  'AUT-3': 'Patrick Pentz',
  'AUT-4': 'David Alaba',
  'AUT-5': 'Kevin Danso',
  'AUT-6': 'Philipp Lienhart',
  'AUT-7': 'Stefan Posch',
  'AUT-8': 'Phillipp Mwene',
  'AUT-9': 'Alexander Prass',
  'AUT-10': 'Xaver Schlager',
  'AUT-11': 'Marcel Sabitzer',
  'AUT-12': 'Konrad Laimer',
  'AUT-14': 'Florian Grillitsch',
  'AUT-15': 'Nicolas Seiwald',
  'AUT-16': 'Romano Schmid',
  'AUT-17': 'Patrick Wimmer',
  'AUT-18': 'Christoph Baumgartner',
  'AUT-19': 'Michael Gregoritsch',
  'AUT-20': 'Marko Arnautović',
  'BEL-2': 'Thibaut Courtois',
  'BEL-3': 'Arthur Theate',
  'BEL-4': 'Timothy Castagne',
  'BEL-5': 'Zeno Debast',
  'BEL-6': 'Brandon Mechele',
  'BEL-7': 'Maxim De Cuyper',
  'BEL-8': 'Thomas Meunier',
  'BEL-9': 'Youri Tielemans',
  'BEL-10': 'Amadou Onana',
  'BEL-11': 'Nicolas Raskin',
  'BEL-12': 'Alexis Saelemaekers',
  'BEL-14': 'Hans Vanaken',
  'BEL-15': 'Kevin De Bruyne',
  'BEL-16': 'Jérémy Doku',
  'BEL-17': 'Charles De Ketelaere',
  'BEL-18': 'Leandro Trossard',
  'BEL-19': 'Loïs Openda',
  'BEL-20': 'Romelu Lukaku',
  'BIH-2': 'Nikola Vasilj',
  'BIH-3': 'Amer Dedic',
  'BIH-4': 'Sead Kolasinac',
  'BIH-5': 'Tarik Muharemovic',
  'BIH-6': 'Nihad Mujakic',
  'BIH-7': 'Nikola Katic',
  'BIH-8': 'Amir Hadziahmetovic',
  'BIH-9': 'Benjamin Tahirovic',
  'BIH-10': 'Armin Gigovic',
  'BIH-11': 'Ivan Sunjic',
  'BIH-12': 'Ivan Basic',
  'BIH-14': 'Dzenis Burnic',
  'BIH-15': 'Esmir Bajraktarevic',
  'BIH-16': 'Amar Memic',
  'BIH-17': 'Ermedin Demirovic',
  'BIH-18': 'Edin Dzeko',
  'BIH-19': 'Samed Bazdar',
  'BIH-20': 'Haris Tabakovic',
  'BRA-2': 'Alisson',
  'BRA-3': 'Bento',
  'BRA-4': 'Marquinhos',
  'BRA-5': 'Éder Militão',
  'BRA-6': 'Gabriel Magalhães',
  'BRA-7': 'Danilo',
  'BRA-8': 'Wesley',
  'BRA-9': 'Lucas Paquetá',
  'BRA-10': 'Casemiro',
  'BRA-11': 'Bruno Guimarães',
  'BRA-12': 'Luiz Henrique',
  'BRA-14': 'Vinicius Júnior',
  'BRA-15': 'Rodrygo',
  'BRA-16': 'João Pedro',
  'BRA-17': 'Matheus Cunha',
  'BRA-18': 'Gabriel Martinelli',
  'BRA-19': 'Raphinha',
  'BRA-20': 'Estévão',
  'CAN-2': 'Dayne St.Clair',
  'CAN-3': 'Alphonso Davies',
  'CAN-4': 'Alistair Johnston',
  'CAN-5': 'Samuel Adekugbe',
  'CAN-6': 'Riche Larvea',
  'CAN-7': 'Derek Cornelius',
  'CAN-8': 'Moïse Bombito',
  'CAN-9': 'Kamal Miller',
  'CAN-10': 'Stephen Eustáquio',
  'CAN-11': 'Ismaël Koné',
  'CAN-12': 'Jonathan Osorio',
  'CAN-14': 'Jacob Shaffelburg',
  'CAN-15': 'Mathieu Choinière',
  'CAN-16': 'Niko Sigur',
  'CAN-17': 'Tajon Buchanan',
  'CAN-18': 'Liam Millar',
  'CAN-19': 'Cyle Larin',
  'CAN-20': 'Jonathan David',
  'CIV-2': 'Yahia Fofana',
  'CIV-3': 'Ghislain Konan',
  'CIV-4': 'Wilfried Singo',
  'CIV-5': 'Odilon Kossounou',
  'CIV-6': 'Evan Ndicka',
  'CIV-7': 'Willy Boly',
  'CIV-8': 'Emmanuel Agbadou',
  'CIV-9': 'Ousmane Diomande',
  'CIV-10': 'Franck Kessie',
  'CIV-11': 'Seko Fofana',
  'CIV-12': 'Ibrahim Sangare',
  'CIV-14': 'Jean-Philippe Gbamin',
  'CIV-15': 'Amad Diallo',
  'CIV-16': 'Sébastien Haller',
  'CIV-17': 'Simon Adingra',
  'CIV-18': 'Yan Diomande',
  'CIV-19': 'Evann Guessand',
  'CIV-20': 'Oumar Diakite',
  'COD-2': 'Lionel Mpasi',
  'COD-3': 'Aaron Wan-Bissaka',
  'COD-4': 'Axel Tuanzebe',
  'COD-5': 'Arthur Masuaku',
  'COD-6': 'Chancel Mbemba',
  'COD-7': 'Joris Kayembe',
  'COD-8': 'Charles Pickel',
  'COD-9': 'Ngal\'ayel Mukau',
  'COD-10': 'Edo Kayembe',
  'COD-11': 'Samuel Moutoussamy',
  'COD-12': 'Noah Sadiki',
  'COD-14': 'Théo Bongonda',
  'COD-15': 'Meschak Elia',
  'COD-16': 'Yoane Wissa',
  'COD-17': 'Brian Cipenga',
  'COD-18': 'Fiston Mayele',
  'COD-19': 'Cédric Bakambu',
  'COD-20': 'Nathanaël Mbuku',
  'COL-2': 'Camilo Vargas',
  'COL-3': 'David Ospina',
  'COL-4': 'Dávinson Sánchez',
  'COL-5': 'Yerry Mina',
  'COL-6': 'Daniel Munoz',
  'COL-7': 'Johan Mojica',
  'COL-8': 'Jhon Lucumí',
  'COL-9': 'Santiago Arias',
  'COL-10': 'Jefferson Lerma',
  'COL-11': 'Kevin Castaño',
  'COL-12': 'Richard Rios',
  'COL-14': 'James Rodriguez',
  'COL-15': 'Juan Fernando Quintero',
  'COL-16': 'Jorge Carrascal',
  'COL-17': 'Jon Arias',
  'COL-18': 'Jhon Cordova',
  'COL-19': 'Luis Suarez',
  'COL-20': 'Luis Diaz',
  'CPV-2': 'Vozinha',
  'CPV-3': 'Logan Costa',
  'CPV-4': 'Pico',
  'CPV-5': 'Diney',
  'CPV-6': 'Steven Moreira',
  'CPV-7': 'Wagner Pina',
  'CPV-8': 'Joao Paulo',
  'CPV-9': 'Yannick Semedo',
  'CPV-10': 'Kevin Pina',
  'CPV-11': 'Patrick Andrade',
  'CPV-12': 'Jamiro Monteiro',
  'CPV-14': 'Deroy Duarte',
  'CPV-15': 'Garry Rodrigues',
  'CPV-16': 'Jovane Cabral',
  'CPV-17': 'Ryan Mendes',
  'CPV-18': 'Dailon Livramento',
  'CPV-19': 'Willy Semedo',
  'CPV-20': 'Bebe',
  'CRO-2': 'Dominik Livaković',
  'CRO-3': 'Duje Caleta-Car',
  'CRO-4': 'Josko Gvardiol',
  'CRO-5': 'Josip Stanišić',
  'CRO-6': 'Luka Vušković',
  'CRO-7': 'Josip Sutalo',
  'CRO-8': 'Kristijan Jakic',
  'CRO-9': 'Luka Modrić',
  'CRO-10': 'Mateo Kovacic',
  'CRO-11': 'Martin Baturina',
  'CRO-12': 'Lovro Majer',
  'CRO-14': 'Mario Pasalic',
  'CRO-15': 'Petar Sucic',
  'CRO-16': 'Ivan Perišić',
  'CRO-17': 'Marco Pasalic',
  'CRO-18': 'Ante Budimir',
  'CRO-19': 'Andrej Kramarić',
  'CRO-20': 'Franjo Ivanovic',
  'CUW-2': 'Eloy Room',
  'CUW-3': 'Armando Obispo',
  'CUW-4': 'Sherel Floranus',
  'CUW-5': 'Jurien Gaari',
  'CUW-6': 'Joshua Brenet',
  'CUW-7': 'Roshon Van Eijma',
  'CUW-8': 'Shurandy Sambo',
  'CUW-9': 'Livano Comenencia',
  'CUW-10': 'Godfried Roemeratoe',
  'CUW-11': 'Juninho Bacuna',
  'CUW-12': 'Leandro Bacuna',
  'CUW-14': 'Tahith Chong',
  'CUW-15': 'Kenji Gorre',
  'CUW-16': 'Jearl Margaritha',
  'CUW-17': 'Jurgen Locadia',
  'CUW-18': 'Jeremy Antonisse',
  'CUW-19': 'Gervane Kastaneer',
  'CUW-20': 'Sontje Hansen',
  'CZE-2': 'Matej Kovar',
  'CZE-3': 'Jindrich Stanek',
  'CZE-4': 'Ladislav Krejci',
  'CZE-5': 'Vladimir Coufal',
  'CZE-6': 'Jaroslav Zeleny',
  'CZE-7': 'Tomas Holes',
  'CZE-8': 'David Zima',
  'CZE-9': 'Michal Sadilek',
  'CZE-10': 'Lukas Provod',
  'CZE-11': 'Lukas Cerv',
  'CZE-12': 'Tomas Soucek',
  'CZE-14': 'Pavel Sulc',
  'CZE-15': 'Matej Vydra',
  'CZE-16': 'Vasil Kusej',
  'CZE-17': 'Tomas Chory',
  'CZE-18': 'Vaclav Cerny',
  'CZE-19': 'Adam Hlozek',
  'CZE-20': 'Patrik Schick',
  'ECU-2': 'Hernán Galíndez',
  'ECU-3': 'Gonzalo Valle',
  'ECU-4': 'Piero Hincapié',
  'ECU-5': 'Pervis Estupiñán',
  'ECU-6': 'Willian Pacho',
  'ECU-7': 'Ángelo Preciado',
  'ECU-8': 'Joel Ordóñez',
  'ECU-9': 'Moises Caicedo',
  'ECU-10': 'Alan Franco',
  'ECU-11': 'Kendry Paez',
  'ECU-12': 'Pedro Vite',
  'ECU-14': 'John Veboah',
  'ECU-15': 'Leonardo Campana',
  'ECU-16': 'Gonzalo Plata',
  'ECU-17': 'Nilson Angulo',
  'ECU-18': 'Alan Minda',
  'ECU-19': 'Kevin Rodriguez',
  'ECU-20': 'Enner Valencia',
  'EGY-2': 'Mohamed El Shenawy',
  'EGY-3': 'Mohamed Hany',
  'EGY-4': 'Mohamed Hamdy',
  'EGY-5': 'Yasser Ibrahim',
  'EGY-6': 'Khaled Sobhi',
  'EGY-7': 'Ramy Rabia',
  'EGY-8': 'Hossam Abdelmaguid',
  'EGY-9': 'Ahmed Fatouh',
  'EGY-10': 'Marwan Attia',
  'EGY-11': 'Zizo',
  'EGY-12': 'Hamdy Fathy',
  'EGY-14': 'Mohamed Lasheen',
  'EGY-15': 'Emam Ashour',
  'EGY-16': 'Osama Faisal',
  'EGY-17': 'Mohamed Salah',
  'EGY-18': 'Mostafa Mohamed',
  'EGY-19': 'Trezeguet',
  'EGY-20': 'Omar Marmoush',
  'ENG-2': 'Jordan Pickford',
  'ENG-3': 'John Stones',
  'ENG-4': 'Marc Guéhi',
  'ENG-5': 'Ezri Konsa',
  'ENG-6': 'Trent Alexander-Arnold',
  'ENG-7': 'Reece James',
  'ENG-8': 'Dan Burn',
  'ENG-9': 'Jordan Henderson',
  'ENG-10': 'Declan Rice',
  'ENG-11': 'Jude Bellingham',
  'ENG-12': 'Cole Palmer',
  'ENG-14': 'Morgan Rogers',
  'ENG-15': 'Anthony Gordon',
  'ENG-16': 'Phil Foden',
  'ENG-17': 'Bukayo Saka',
  'ENG-18': 'Harry Kane',
  'ENG-19': 'Marcus Rashford',
  'ENG-20': 'Ollie Watkins',
  'ESP-2': 'Unai Simon',
  'ESP-3': 'Robin Le Normand',
  'ESP-4': 'Aymeric Laporte',
  'ESP-5': 'Dean Huijsen',
  'ESP-6': 'Pedro Porro',
  'ESP-7': 'Dani Carvajal',
  'ESP-8': 'Marc Cucurella',
  'ESP-9': 'Martín Zubimendi',
  'ESP-10': 'Rodri',
  'ESP-11': 'Pedri',
  'ESP-12': 'Fabian Ruiz',
  'ESP-14': 'Mikel Merino',
  'ESP-15': 'Lamine Yamal',
  'ESP-16': 'Dani Olmo',
  'ESP-17': 'Nico Williams',
  'ESP-18': 'Ferran Torres',
  'ESP-19': 'Álvaro Morata',
  'ESP-20': 'Mikel Oyarzabal',
  'FRA-2': 'Mike Maignan',
  'FRA-3': 'Theo Hernandez',
  'FRA-4': 'William Saliba',
  'FRA-5': 'Jules Kounde',
  'FRA-6': 'Ibrahima Konate',
  'FRA-7': 'Dayot Upamecano',
  'FRA-8': 'Lucas Digne',
  'FRA-9': 'Aurélien Tchouaméni',
  'FRA-10': 'Eduardo Camavinga',
  'FRA-11': 'Manu Kone',
  'FRA-12': 'Adrien Rabiot',
  'FRA-14': 'Michael Olise',
  'FRA-15': 'Ousmane Dembele',
  'FRA-16': 'Bradley Barcola',
  'FRA-17': 'Désiré Doué',
  'FRA-18': 'Kingsley Coman',
  'FRA-19': 'Hugo Ekitike',
  'FRA-20': 'Kylian Mbappe',
  'GER-2': 'Marc-André ter Stegen',
  'GER-3': 'Jonathan Tah',
  'GER-4': 'David Raum',
  'GER-5': 'Nico Schlotterbeck',
  'GER-6': 'Antonio Rüdiger',
  'GER-7': 'Waldemar Anton',
  'GER-8': 'Ridle Baku',
  'GER-9': 'Maximilian Mittelstadt',
  'GER-10': 'Joshua Kimmich',
  'GER-11': 'Florian Wirtz',
  'GER-12': 'Felix Nmecha',
  'GER-14': 'Leon Goretzka',
  'GER-15': 'Jamal Musiala',
  'GER-16': 'Serge Gnabry',
  'GER-17': 'Kai Havertz',
  'GER-18': 'Leroy Sane',
  'GER-19': 'Karim Adeyemi',
  'GER-20': 'Nick Woltemade',
  'GHA-2': 'Lawrence Ati Zigi',
  'GHA-3': 'Tariq Lamptey',
  'GHA-4': 'Mohammed Salisu',
  'GHA-5': 'Alidu Seidu',
  'GHA-6': 'Alexander Djiku',
  'GHA-7': 'Gideon Mensah',
  'GHA-8': 'Caleb Yirenkyi',
  'GHA-9': 'Abdul Issahaku Fatawu',
  'GHA-10': 'Thomas Partey',
  'GHA-11': 'Salis Abdul Samed',
  'GHA-12': 'Kamaldeen Sulemana',
  'GHA-14': 'Mohammed Kudus',
  'GHA-15': 'Inaki Williams',
  'GHA-16': 'Jordan Ayew',
  'GHA-17': 'Andrew Ayew',
  'GHA-18': 'Joseph Paintsil',
  'GHA-19': 'Osman Bukari',
  'GHA-20': 'Antoine Semenyo',
  'HAI-2': 'Johny Placide',
  'HAI-3': 'Carlens Arcus',
  'HAI-4': 'Martin Expérience',
  'HAI-5': 'Jean-Kevin Duverne',
  'HAI-6': 'Ricardo Adé',
  'HAI-7': 'Duke Lacroix',
  'HAI-8': 'Garven Metusala',
  'HAI-9': 'Hannes Delcroix',
  'HAI-10': 'Leverton Pierre',
  'HAI-11': 'Danley Jean Jacques',
  'HAI-12': 'Jean-Ricner Bellegarde',
  'HAI-14': 'Christopher Attys',
  'HAI-15': 'Derrick Etienne Jr',
  'HAI-16': 'Josue Casimir',
  'HAI-17': 'Ruben Providence',
  'HAI-18': 'Duckens Nazon',
  'HAI-19': 'Louicius Deedson',
  'HAI-20': 'Frantzdy Pierrot',
  'IRN-2': 'Alireza Beiranvand',
  'IRN-3': 'Morteza Pouraliganji',
  'IRN-4': 'Ehsan Hajsafi',
  'IRN-5': 'Milad Mohammadi',
  'IRN-6': 'Shojae Khalilzadeh',
  'IRN-7': 'Ramin Rezaeian',
  'IRN-8': 'Hossein Kanaani',
  'IRN-9': 'Sadegh Moharrami',
  'IRN-10': 'Saleh Hardani',
  'IRN-11': 'Saeed Ezatolahi',
  'IRN-12': 'Saman Ghoddos',
  'IRN-14': 'Omid Noorafkan',
  'IRN-15': 'Roozbeh Cheshmi',
  'IRN-16': 'Mohammad Mohebi',
  'IRN-17': 'Sardar Azmoun',
  'IRN-18': 'Mehdi Taremi',
  'IRN-19': 'Alireza Jahanbakhsh',
  'IRN-20': 'Ali Gholizadeh',
  'IRQ-2': 'Jalal Hassan',
  'IRQ-3': 'Rebin Sulaka',
  'IRQ-4': 'Hussein Ali',
  'IRQ-5': 'Akam Hashem',
  'IRQ-6': 'Merchas Doski',
  'IRQ-7': 'Zaid Tahseen',
  'IRQ-8': 'Manaf Younis',
  'IRQ-9': 'Zidane Iqbal',
  'IRQ-10': 'Amir Al-Ammari',
  'IRQ-11': 'Ibrahim Bavesh',
  'IRQ-12': 'Ali Jasim',
  'IRQ-14': 'Youssef Amyn',
  'IRQ-15': 'Aimar Sher',
  'IRQ-16': 'Marko Farji',
  'IRQ-17': 'Osama Rashid',
  'IRQ-18': 'Ali Al-Hamadi',
  'IRQ-19': 'Aymen Hussein',
  'IRQ-20': 'Mohanad Ali',
  'JOR-2': 'Yazeed Abulaila',
  'JOR-3': 'Ihsan Haddad',
  'JOR-4': 'Mohammad Abu Hashish',
  'JOR-5': 'Yazan Al-Arab',
  'JOR-6': 'Abdallah Nasib',
  'JOR-7': 'Saleem Obaid',
  'JOR-8': 'Mohammad Abualnadi',
  'JOR-9': 'Ibrahim Saadeh',
  'JOR-10': 'Nizar Al-Rashdan',
  'JOR-11': 'Noor Al-Rawabdeh',
  'JOR-12': 'Mohannad Abu Taha',
  'JOR-14': 'Amer Jamous',
  'JOR-15': 'Musa Al-Taamari',
  'JOR-16': 'Yazan Al-Naimat',
  'JOR-17': 'Mahmoud Al-Mardi',
  'JOR-18': 'Ali Olwan',
  'JOR-19': 'Mohammad Abu Zrayq',
  'JOR-20': 'Ibrahim Sabra',
  'JPN-2': 'Zion Suzuki',
  'JPN-3': 'Henry Heroki Mochizuki',
  'JPN-4': 'Ayumu Seko',
  'JPN-5': 'Junnosuke Suzuki',
  'JPN-6': 'Shogo Taniguchi',
  'JPN-7': 'Tsuyoshi Watanabe',
  'JPN-8': 'Kaishu Sano',
  'JPN-9': 'Yuki Soma',
  'JPN-10': 'Ao Tanaka',
  'JPN-11': 'Daichi Kamada',
  'JPN-12': 'Takefusa Kubo',
  'JPN-14': 'Ritsu Doan',
  'JPN-15': 'Keito Nakamura',
  'JPN-16': 'Takumi Minamino',
  'JPN-17': 'Shuto Machino',
  'JPN-18': 'Junya Ito',
  'JPN-19': 'Koki Ogawa',
  'JPN-20': 'Ayase Ueda',
  'KOR-2': 'Hyeon-woo Jo',
  'KOR-3': 'Seung-Gyu Kim',
  'KOR-4': 'Min-jae Kim',
  'KOR-5': 'Yu-min Cho',
  'KOR-6': 'Young-woo Seol',
  'KOR-7': 'Han-beom Lee',
  'KOR-8': 'Tae-seok Lee',
  'KOR-9': 'Myung-jae Lee',
  'KOR-10': 'Jae-sung Lee',
  'KOR-11': 'In-beom Hwang',
  'KOR-12': 'Kang-in Lee',
  'KOR-14': 'Seung-ho Paik',
  'KOR-15': 'Jens Castrop',
  'KOR-16': 'Dongg-yeong Lee',
  'KOR-17': 'Gue-sung Cho',
  'KOR-18': 'Heung-min Son',
  'KOR-19': 'Hee-chan Hwang',
  'KOR-20': 'Hyeon-Gyu Oh',
  'KSA-2': 'Nawaf Alaqidi',
  'KSA-3': 'Abdulrahman Al-Sanbi',
  'KSA-4': 'Saud Abdulhamid',
  'KSA-5': 'Nawaf Bouwashl',
  'KSA-6': 'Jihad Thakri',
  'KSA-7': 'Moteb Al-Harbi',
  'KSA-8': 'Hassan Altambakti',
  'KSA-9': 'Musab Aljuwayr',
  'KSA-10': 'Ziyad Aljohani',
  'KSA-11': 'Abdullah Alkhaibari',
  'KSA-12': 'Nasser Aldawsari',
  'KSA-14': 'Saleh Abu Alshamat',
  'KSA-15': 'Marwan Alsahafi',
  'KSA-16': 'Salem Aldawsari',
  'KSA-17': 'Abdulrahman Al-Aboud',
  'KSA-18': 'Feras Akbrikan',
  'KSA-19': 'Saleh Alshehri',
  'KSA-20': 'Abdullah Al-Hamdan',
  'MAR-2': 'Yassine Bounou',
  'MAR-3': 'Munir El Kajoui',
  'MAR-4': 'Achraf Hakimi',
  'MAR-5': 'Noussair Mazraoui',
  'MAR-6': 'Nayef Aguerd',
  'MAR-7': 'Roman Saiss',
  'MAR-8': 'Jawad El Yamio',
  'MAR-9': 'Adam Masina',
  'MAR-10': 'Sofyan Amrabat',
  'MAR-11': 'Azzedine Ounahi',
  'MAR-12': 'Eliesse Ben Seghir',
  'MAR-14': 'Bilal El Khannouss',
  'MAR-15': 'Ismael Saibari',
  'MAR-16': 'Youssef En-Nesyri',
  'MAR-17': 'Abde Ezzalzouli',
  'MAR-18': 'Soufiane Rahimi',
  'MAR-19': 'Brahim Diaz',
  'MAR-20': 'Ayoub El Kaabi',
  'MEX-2': 'Luis Malagón',
  'MEX-3': 'Johan Vasquez',
  'MEX-4': 'Jorge Sánchez',
  'MEX-5': 'Cesar Montes',
  'MEX-6': 'Jesus Gallardo',
  'MEX-7': 'Israel Reyes',
  'MEX-8': 'Diego Lainez',
  'MEX-9': 'Carlos Rodriguez',
  'MEX-10': 'Edson Alvarez',
  'MEX-11': 'Orbelin Pineda',
  'MEX-12': 'Marcel Ruiz',
  'MEX-14': 'Érick Sánchez',
  'MEX-15': 'Hirving Lozano',
  'MEX-16': 'Santiago Giménez',
  'MEX-17': 'Raúl Jiménez',
  'MEX-18': 'Alexis Vega',
  'MEX-19': 'Roberto Alvarado',
  'MEX-20': 'Cesar Huerta',
  'NED-2': 'Bart Verbruggen',
  'NED-3': 'Virgil van Dijk',
  'NED-4': 'Micky van de Ven',
  'NED-5': 'Jurrien Timber',
  'NED-6': 'Denzel Dumfries',
  'NED-7': 'Nathan Aké',
  'NED-8': 'Jeremie Frimpong',
  'NED-9': 'Jan Paul van Hecke',
  'NED-10': 'Tijjani Reijnders',
  'NED-11': 'Ryan Gravenberch',
  'NED-12': 'Teun Koopmeiners',
  'NED-14': 'Frenkie de Jong',
  'NED-15': 'Xavi Simons',
  'NED-16': 'Justin Kluivert',
  'NED-17': 'Memphis Depay',
  'NED-18': 'Donyell Malen',
  'NED-19': 'Wout Weghorst',
  'NED-20': 'Cody Gakpo',
  'NOR-2': 'Orjan Nyland',
  'NOR-3': 'Julian Ryerson',
  'NOR-4': 'Leo Ostigård',
  'NOR-5': 'Kristoffer Vassbakk Ajer',
  'NOR-6': 'Marcus Holmgren Pedersen',
  'NOR-7': 'David Møller Wolfe',
  'NOR-8': 'Torbjørn Heggem',
  'NOR-9': 'Morten Thorsby',
  'NOR-10': 'Martin Ødegaard',
  'NOR-11': 'Sander Berge',
  'NOR-12': 'Andreas Schjelderup',
  'NOR-14': 'Patrick Berg',
  'NOR-15': 'Erling Haaland',
  'NOR-16': 'Alexander Sørloth',
  'NOR-17': 'Aron Dønnum',
  'NOR-18': 'Jorgen Strand Larsen',
  'NOR-19': 'Antonio Nusa',
  'NOR-20': 'Oscar Bobb',
  'NZL-2': 'Max Crocombe Payne',
  'NZL-3': 'Alex Paulsen',
  'NZL-4': 'Michael Boxall',
  'NZL-5': 'Liberato Cacace',
  'NZL-6': 'Tim Payne',
  'NZL-7': 'Tyler Bindon',
  'NZL-8': 'Francis de Vries',
  'NZL-9': 'Finn Surman',
  'NZL-10': 'Joe Bell',
  'NZL-11': 'Sarpreet Singh',
  'NZL-12': 'Ryan Thomas',
  'NZL-14': 'Matthew Garbett',
  'NZL-15': 'Marko Stamenić',
  'NZL-16': 'Ben Old',
  'NZL-17': 'Chris Wood',
  'NZL-18': 'Elijah Just',
  'NZL-19': 'Callum McCowatt',
  'NZL-20': 'Kosta Barbarouses',
  'PAN-2': 'Orlando Mosquera',
  'PAN-3': 'Luis Mejia',
  'PAN-4': 'Fidel Escobar',
  'PAN-5': 'Andres Andrade',
  'PAN-6': 'Michael Amir Murillo',
  'PAN-7': 'Eric Davis',
  'PAN-8': 'Jose Cordoba',
  'PAN-9': 'Cesar Blackman',
  'PAN-10': 'Cristian Martinez',
  'PAN-11': 'Aníbal Godoy',
  'PAN-12': 'Adalberto Carrasquilla',
  'PAN-14': 'Édgar Bárcenas',
  'PAN-15': 'Carlos Harvey',
  'PAN-16': 'Ismael Díaz',
  'PAN-17': 'Jose Fajardo',
  'PAN-18': 'Cecilio Waterman',
  'PAN-19': 'Jose Luiz Rodriguez',
  'PAN-20': 'Alberto Quintero',
  'PAR-2': 'Roberto Fernandez',
  'PAR-3': 'Orlando Gill',
  'PAR-4': 'Gustavo Gomez',
  'PAR-5': 'Fabián Balbuena',
  'PAR-6': 'Juan José Cáceres',
  'PAR-7': 'Omar Alderete',
  'PAR-8': 'Junior Alonso',
  'PAR-9': 'Mathías Villasanti',
  'PAR-10': 'Diego Gomez',
  'PAR-11': 'Damián Bobadilla',
  'PAR-12': 'Andres Cubas',
  'PAR-14': 'Matias Galarza Fonda',
  'PAR-15': 'Julio Enciso',
  'PAR-16': 'Alejandro Romero Gamarra',
  'PAR-17': 'Miguel Almirón',
  'PAR-18': 'Ramon Sosa',
  'PAR-19': 'Angel Romero',
  'PAR-20': 'Antonio Sanabria',
  'POR-2': 'Diogo Costa',
  'POR-3': 'Jose Sa',
  'POR-4': 'Ruben Dias',
  'POR-5': 'João Cancelo',
  'POR-6': 'Diogo Dalot',
  'POR-7': 'Nuno Mendes',
  'POR-8': 'Gonçalo Inácio',
  'POR-9': 'Bernardo Silva',
  'POR-10': 'Bruno Fernandes',
  'POR-11': 'Ruben Neves',
  'POR-12': 'Vitinha',
  'POR-14': 'João Neves',
  'POR-15': 'Cristiano Ronaldo',
  'POR-16': 'Francisco Trincao',
  'POR-17': 'João Felix',
  'POR-18': 'Gonçalo Ramos',
  'POR-19': 'Pedro Neto',
  'POR-20': 'Rafael Leão',
  'QAT-2': 'Meshaal Barsham',
  'QAT-3': 'Sultan Albrake',
  'QAT-4': 'Lucas Mendes',
  'QAT-5': 'Homam Ahmed',
  'QAT-6': 'Boualem Khoukhi',
  'QAT-7': 'Pedro Miguel',
  'QAT-8': 'Tarek Salman',
  'QAT-9': 'Mohamed Al-Mannai',
  'QAT-10': 'Karim Boudiaf',
  'QAT-11': 'Assim Madibo',
  'QAT-12': 'Ahmed Fatehi',
  'QAT-14': 'Mohammed Waad',
  'QAT-15': 'Abdulaziz Hatem',
  'QAT-16': 'Hassan Al-Haydos',
  'QAT-17': 'Edmilson Junior',
  'QAT-18': 'Akram Hassan Afif',
  'QAT-19': 'Ahmed Al Ganehi',
  'QAT-20': 'Almoez Ali',
  'RSA-2': 'Ronwen Williams',
  'RSA-3': 'Sipho Chaine',
  'RSA-4': 'Aubrey Modiba',
  'RSA-5': 'Samukele Kabini',
  'RSA-6': 'Mbekezeli Mbokazi',
  'RSA-7': 'Khulumani Ndamane',
  'RSA-8': 'Siyabonga Ngezana',
  'RSA-9': 'Khuliso Mudau',
  'RSA-10': 'Nkosinathi Sibisi',
  'RSA-11': 'Teboho Mokoena',
  'RSA-12': 'Thalente Mbatha',
  'RSA-14': 'Bathasi Aubaas',
  'RSA-15': 'Yaya Sithole',
  'RSA-16': 'Sipho Mbule',
  'RSA-17': 'Lyle Foster',
  'RSA-18': 'Iqraam Rayners',
  'RSA-19': 'Mohau Nkota',
  'RSA-20': 'Oswin Appollis',
  'SCO-2': 'Angus Gunn',
  'SCO-3': 'Jack Hendry',
  'SCO-4': 'Kieran Tierney',
  'SCO-5': 'Aaron Hickey',
  'SCO-6': 'Andrew Robertson',
  'SCO-7': 'Scott McKenna',
  'SCO-8': 'John Souttar',
  'SCO-9': 'Anthony Ralston',
  'SCO-10': 'Grant Hanley',
  'SCO-11': 'Scott McTominay',
  'SCO-12': 'Billy Gilmour',
  'SCO-14': 'Lewis Ferguson',
  'SCO-15': 'Ryan Christie',
  'SCO-16': 'Kenny McLean',
  'SCO-17': 'John McGinn',
  'SCO-18': 'Lyndon Dykes',
  'SCO-19': 'Che Adams',
  'SCO-20': 'Ben Gannon-Doak',
  'SEN-2': 'Edouard Mendy',
  'SEN-3': 'Yehvann Diouf',
  'SEN-4': 'Moussa Niakhaté',
  'SEN-5': 'Abdoulaye Seck',
  'SEN-6': 'Ismail Jakobs',
  'SEN-7': 'El Hadji Malick Diouf',
  'SEN-8': 'Kalidou Koulibaly',
  'SEN-9': 'Idrissa Gana Gueye',
  'SEN-10': 'Pape Matar Sarr',
  'SEN-11': 'Pape Gueye',
  'SEN-12': 'Habib Diarra',
  'SEN-14': 'Lamine Camara',
  'SEN-15': 'Sadio Mane',
  'SEN-16': 'Ismaïla Sarr',
  'SEN-17': 'Boulaye Dia',
  'SEN-18': 'Iliman Ndiaye',
  'SEN-19': 'Nicolas Jackson',
  'SEN-20': 'Krepin Diatta',
  'SUI-2': 'Gregor Kobel',
  'SUI-3': 'Yvon Mvogo',
  'SUI-4': 'Manuel Akanji',
  'SUI-5': 'Ricardo Rodriguez',
  'SUI-6': 'Nico Elvedi',
  'SUI-7': 'Aurèle Amenda',
  'SUI-8': 'Silvan Widmer',
  'SUI-9': 'Granit Xhaka',
  'SUI-10': 'Denis Zakaria',
  'SUI-11': 'Remo Freuler',
  'SUI-12': 'Fabian Rieder',
  'SUI-14': 'Ardon Jashari',
  'SUI-15': 'Johan Manzambi',
  'SUI-16': 'Michel Aebischer',
  'SUI-17': 'Breel Embolo',
  'SUI-18': 'Ruben Vargas',
  'SUI-19': 'Dan Ndoye',
  'SUI-20': 'Zeki Amdouni',
  'SWE-2': 'Victor Johansson',
  'SWE-3': 'Isak Hien',
  'SWE-4': 'Gabriel Gudmundsson',
  'SWE-5': 'Emil Holm',
  'SWE-6': 'Victor Nilsson Lindelöf',
  'SWE-7': 'Gustaf Lagerbielke',
  'SWE-8': 'Lucas Bergvall',
  'SWE-9': 'Hugo Larsson',
  'SWE-10': 'Jesper Karlström',
  'SWE-11': 'Yasin Ayari',
  'SWE-12': 'Mattias Svanberg',
  'SWE-14': 'Daniel Svensson',
  'SWE-15': 'Ken Sema',
  'SWE-16': 'Roony Bardghji',
  'SWE-17': 'Dejan Kulusevski',
  'SWE-18': 'Anthony Elanga',
  'SWE-19': 'Alexander Isak',
  'SWE-20': 'Viktor Gyökeres',
  'TUN-2': 'Bechir Ben Said',
  'TUN-3': 'Aymen Dahmen',
  'TUN-4': 'Yan Valery',
  'TUN-5': 'Montassar Talbi',
  'TUN-6': 'Yassine Meriah',
  'TUN-7': 'Ali Abdi',
  'TUN-8': 'Dylan Bronn',
  'TUN-9': 'Ellyes Skhiri',
  'TUN-10': 'Aissa Laidouni',
  'TUN-11': 'Ferjani Sassi',
  'TUN-12': 'Mohamed Ali Ben Romdhane',
  'TUN-14': 'Hannibal Mejbri',
  'TUN-15': 'Elias Achouri',
  'TUN-16': 'Elias Saad',
  'TUN-17': 'Hazem Mastouri',
  'TUN-18': 'Ismael Gharbi',
  'TUN-19': 'Sayfallah Ltaief',
  'TUN-20': 'Naim Sliti',
  'TUR-2': 'Ugurcan Cakir',
  'TUR-3': 'Mert Muldur',
  'TUR-4': 'Zeki Celik',
  'TUR-5': 'Abdulkerim Bardakci',
  'TUR-6': 'Caglar Soyuncu',
  'TUR-7': 'Merih Demiral',
  'TUR-8': 'Ferdi Kadioglu',
  'TUR-9': 'Kaan Ayhan',
  'TUR-10': 'Ismail Yuksek',
  'TUR-11': 'Hakan Calhanoglu',
  'TUR-12': 'Orkun Kokcu',
  'TUR-14': 'Arda Guler',
  'TUR-15': 'Irfan Can Kahveci',
  'TUR-16': 'Yunus Akgun',
  'TUR-17': 'Can Uzun',
  'TUR-18': 'Baris Alper Yilmaz',
  'TUR-19': 'Kerem Akturkoglu',
  'TUR-20': 'Kenan Yildiz',
  'URU-2': 'Sergio Rochet',
  'URU-3': 'Santiago Mele',
  'URU-4': 'Ronald Araujo',
  'URU-5': 'José María Giménez',
  'URU-6': 'Sebastian Caceres',
  'URU-7': 'Mathias Olivera',
  'URU-8': 'Guillermo Varela',
  'URU-9': 'Nahitan Nandez',
  'URU-10': 'Federico Valverde',
  'URU-11': 'Giorgian De Arrascaeta',
  'URU-12': 'Rodrigo Bentancur',
  'URU-14': 'Manuel Ugarte',
  'URU-15': 'Nicolás de la Cruz',
  'URU-16': 'Maxi Araujo',
  'URU-17': 'Darwin Núñez',
  'URU-18': 'Federico Viñas',
  'URU-19': 'Rodrigo Aguirre',
  'URU-20': 'Facundo Pellistri',
  'USA-2': 'Math Freese',
  'USA-3': 'Chris Richards',
  'USA-4': 'Tim Ream',
  'USA-5': 'Mark McKenzie',
  'USA-6': 'Alex Freeman',
  'USA-7': 'Antonee Robinson',
  'USA-8': 'Tyler Adams',
  'USA-9': 'Tanner Tessmann',
  'USA-10': 'Weston McKenny',
  'USA-11': 'Christian Roldan',
  'USA-12': 'Timothy Weah',
  'USA-14': 'Diego Luna',
  'USA-15': 'Malik Tillman',
  'USA-16': 'Christian Pulisic',
  'USA-17': 'Brenden Aaronson',
  'USA-18': 'Ricardo Pepi',
  'USA-19': 'Haji Wright',
  'USA-20': 'Folarin Balogun',
  'UZB-2': 'Utkir Yusupov',
  'UZB-3': 'Farrukh Savfiev',
  'UZB-4': 'Sherzod Nasrullaev',
  'UZB-5': 'Umar Eshmurodov',
  'UZB-6': 'Husniddin Aliqulov',
  'UZB-7': 'Rustamjon Ashurmatov',
  'UZB-8': 'Khojiakbar Alijonov',
  'UZB-9': 'Abdukodir Khusanov',
  'UZB-10': 'Odiljon Hamrobekov',
  'UZB-11': 'Otabek Shukurov',
  'UZB-12': 'Jamshid Iskanderov',
  'UZB-14': 'Azizbek Turgunboev',
  'UZB-15': 'Khojimat Erkinov',
  'UZB-16': 'Eldor Shomurodov',
  'UZB-17': 'Oston Urunov',
  'UZB-18': 'Jaloliddin Masharipov',
  'UZB-19': 'Igor Sergeev',
  'UZB-20': 'Abbosbek Fayzullaev',
};



const INTRO_INFO = [
  { labelKey: 'intro.logo',          code: 'PANINI',   accent: '#0F0F12', flag: '' },
  { labelKey: 'intro.emblem',        code: 'FIFA 26',  accent: '#E11D48', flag: '' },
  { labelKey: 'intro.emblemVariant', code: 'FIFA 26',  accent: '#9333EA', flag: '' },
  { labelKey: 'intro.mascots',       code: 'MASCOTAS', accent: '#0EA5E9', flag: '' },
  { labelKey: 'intro.slogan',        code: 'ESLOGAN',  accent: '#F59E0B', flag: '' },
  { labelKey: 'intro.ball',          code: 'PELOTA',   accent: '#10B981', flag: '⚽' },
  { labelKey: 'intro.host.canada',   code: 'CAN',      accent: '#D52B1E', flag: '🇨🇦' },
  { labelKey: 'intro.host.mexico',   code: 'MEX',      accent: '#006847', flag: '🇲🇽' },
  { labelKey: 'intro.host.usa',      code: 'USA',      accent: '#1B2C5C', flag: '🇺🇸' },
];

const MUSEUM_INFO = [
  { labelKey: 'museum.italy1934',        code: '1934', accent: '#0066CC', flag: '🇮🇹', countryCode: 'ITA' },
  { labelKey: 'museum.uruguay1950',      code: '1950', accent: '#0038A8', flag: '🇺🇾', countryCode: 'URU' },
  { labelKey: 'museum.westGermany1954',  code: '1954', accent: '#1A1A1A', flag: '🇩🇪', countryCode: 'GER' },
  { labelKey: 'museum.brazil1962',       code: '1962', accent: '#FFCC29', flag: '🇧🇷', countryCode: 'BRA' },
  { labelKey: 'museum.westGermany1974',  code: '1974', accent: '#1A1A1A', flag: '🇩🇪', countryCode: 'GER' },
  { labelKey: 'museum.argentina1986',    code: '1986', accent: '#74ACDF', flag: '🇦🇷', countryCode: 'ARG' },
  { labelKey: 'museum.brazil1994',       code: '1994', accent: '#FFCC29', flag: '🇧🇷', countryCode: 'BRA' },
  { labelKey: 'museum.brazil2002',       code: '2002', accent: '#FFCC29', flag: '🇧🇷', countryCode: 'BRA' },
  { labelKey: 'museum.italy2006',        code: '2006', accent: '#0066CC', flag: '🇮🇹', countryCode: 'ITA' },
  { labelKey: 'museum.germany2014',      code: '2014', accent: '#1A1A1A', flag: '🇩🇪', countryCode: 'GER' },
  { labelKey: 'museum.argentina2022',    code: '2022', accent: '#74ACDF', flag: '🇦🇷', countryCode: 'ARG' },
];

const COCA_INFO = [
  { label: 'Lamine Yamal',      code: 'ESP', accent: '#AA151B', flag: '🇪🇸' },
  { label: 'Joshua Kimmich',    code: 'GER', accent: '#1A1A1A', flag: '🇩🇪' },
  { label: 'Harry Kane',        code: 'ENG', accent: '#CE1124', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { label: 'Santiago Giménez',  code: 'MEX', accent: '#006847', flag: '🇲🇽' },
  { label: 'Antonee Robinson',  code: 'USA', accent: '#1B2C5C', flag: '🇺🇸' },
  { label: 'Jefferson Lerma',   code: 'COL', accent: '#FCD116', flag: '🇨🇴' },
  { label: 'Edson Álvarez',     code: 'MEX', accent: '#006847', flag: '🇲🇽' },
  { label: 'Virgil van Dijk',   code: 'NED', accent: '#FF6900', flag: '🇳🇱' },
  { label: 'Alphonso Davies',   code: 'CAN', accent: '#D52B1E', flag: '🇨🇦' },
  { label: 'Weston McKennie',   code: 'USA', accent: '#1B2C5C', flag: '🇺🇸' },
  { label: 'Lautaro Martínez',  code: 'ARG', accent: '#74ACDF', flag: '🇦🇷' },
  { label: 'Gabriel Magalhães', code: 'BRA', accent: '#FFCC29', flag: '🇧🇷' },
];

const STICKERS_PER_TEAM = 20;
const INTRO_COUNT = 9;
const MUSEUM_COUNT = 11;
const COCA_COUNT = 12;
const TOTAL_BASE = INTRO_COUNT + MUSEUM_COUNT + 48 * STICKERS_PER_TEAM; // 980

const STORAGE_KEY = 'panini26-counts-v2';
const NAMES_KEY = 'panini26-names-v2';
const LANG_KEY = 'panini26-lang-v1';
const SYNC_CODE_KEY = 'panini26-sync-code-v1';
const SYNC_TS_KEY = 'panini26-sync-ts-v1';
const FIREBASE_DB = 'https://album-panini-26-default-rtdb.firebaseio.com';

// =========================
// i18n
// =========================
const SUPPORTED_LANGS = ['es', 'en', 'fr', 'it', 'pt'];
const DEFAULT_LANG = 'en';

const LANG_INFO = {
  es: { code: 'es', label: 'Español',    flag: '🇪🇸' },
  en: { code: 'en', label: 'English',    flag: '🇬🇧' },
  fr: { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  it: { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  pt: { code: 'pt', label: 'Português',  flag: '🇧🇷' },
};

const T = {
  es: {
    'loading': 'CARGANDO ÁLBUM...',
    'home.brand.album': 'ÁLBUM',
    'home.brand.location': 'Mundial · USA · México · Canadá',
    'home.reset.aria': 'Reiniciar',
    'home.progress': 'PROGRESO',
    'home.stats.collected': 'pegadas',
    'home.stats.missing': 'faltan',
    'home.stats.dupes': 'repes',
    'home.action.search': 'Buscar',
    'home.action.search.sub': 'por nombre o equipo',
    'home.action.repes': 'Mis repes',
    'home.action.repes.sub.has': 'para intercambiar',
    'home.action.repes.sub.empty': 'todavía nada',
    'home.sections': 'SECCIONES DEL ÁLBUM',
    'home.autosave': 'SE GUARDA AUTOMÁTICAMENTE',
    'home.welcome.title': '¡Empezá tu álbum!',
    'home.welcome.body': 'Elegí una sección a la izquierda para ver las figuritas.',
    'section.intro.title': 'FWC',
    'section.intro.sub': 'Trofeo, mascota, estadios',
    'section.teams.title': 'Equipos',
    'section.teams.sub': '48 selecciones · 12 grupos',
    'section.museum.title': 'FWC',
    'section.museum.sub': 'Campeones de la historia',
    'section.coca.title': 'Extras Coca-Cola',
    'section.coca.sub': 'No cuentan en el 980',
    'section.bonus.badge': 'BONUS',
    'simplegrid.intro.sub': 'Logo, emblemas, mascotas, sedes',
    'simplegrid.coca.sub': '12 stickers exclusivos',
    'group': 'GRUPO',
    'page': 'PÁG.',
    'header.back': 'Volver',
    'team.back': 'Equipos',
    'team.weAre': 'WE ARE',
    'team.complete': 'COMPLETO ✓',
    'team.repe': 'repe',
    'team.repesPlural': 'repes',
    'team.repesPanel': 'REPES PARA INTERCAMBIAR',
    'sticker.escudo': 'ESCUDO',
    'sticker.equipo': 'EQUIPO',
    'sticker.namePlaceholder': 'nombre',
    'modal.figurita': 'FIGURITA',
    'modal.placeholder': 'Nombre del jugador',
    'modal.cancel': 'Cancelar',
    'modal.save': 'Guardar',
    'modal.lastFigurita': 'ÚLTIMA FIGURITA',
    'modal.saveAndAdvance': 'GUARDA Y AVANZA AL SIGUIENTE',
    'search.back': 'Inicio',
    'search.placeholder': 'Nombre, país, código FIFA, número...',
    'search.howTo': 'CÓMO BUSCAR',
    'search.howTo.player': 'jugador',
    'search.howTo.country': 'país',
    'search.howTo.fifaCode': 'código FIFA',
    'search.howTo.number': 'número',
    'search.howTo.year': 'año (Museo)',
    'search.howTo.byLabel': 'Por',
    'search.empty.title': 'Sin resultados',
    'search.empty.sub': 'Probá con otro nombre, país o código',
    'search.result': 'RESULTADO',
    'search.results': 'RESULTADOS',
    'search.tapHint.add': 'TOCÁ UN RESULTADO PARA SUMAR',
    'search.tapHint.sub': 'TOCÁ UN RESULTADO PARA RESTAR',
    'result.noName': '(sin nombre)',
    'result.missing': 'FALTA',
    'repes.label': 'PARA INTERCAMBIAR',
    'repes.title': 'Mis repes',
    'repes.figRepeated': 'figurita repetida',
    'repes.figRepeatedPlural': 'figuritas repetidas',
    'repes.distinct': 'figurita distinta',
    'repes.distinctPlural': 'figuritas distintas',
    'repes.in': 'en',
    'repes.ofStuck': 'sobre las pegadas',
    'repes.empty.title': 'Todavía no tenés repes',
    'repes.empty.sub': 'Cuando tengas una figurita más de una vez, va a aparecer acá para que la tengas a mano cuando intercambies.',
    'repes.tapHint.add': 'TOCÁ PARA SUMAR · CAMBIÁ EL MODO ARRIBA',
    'repes.tapHint.sub': 'TOCÁ PARA RESTAR · CAMBIÁ EL MODO ARRIBA',
    'pageNav.prev': 'ANTERIOR',
    'pageNav.next': 'SIGUIENTE',
    'mode.add': 'Sumar',
    'mode.sub': 'Restar',
    'legend.title': 'CÓMO SE USA',
    'legend.tap': 'Tocá una figurita para marcarla / sumarle',
    'legend.swap.before': 'Cambiá a',
    'legend.swap.after': 'para quitar repes',
    'legend.dupes': 'El número amarillo indica cuántas repes tenés',
    'legend.editName.before': 'Tocá',
    'legend.editName.after': 'debajo del jugador para escribir cómo se llama',
    'reset.title': '¿Borrar todo?',
    'reset.body': 'Vas a perder todo tu progreso del álbum. Esta acción no se puede deshacer.',
    'reset.cancel': 'Cancelar',
    'reset.confirm': 'Borrar todo',
    'lang.picker': 'Idioma',
    'install.button': 'Instalar app',
    'install.subtitle': 'Tenelo a mano en tu pantalla de inicio',
    'install.ios.title': 'Instalar en iPhone',
    'install.ios.step1': 'Tocá el botón Compartir',
    'install.ios.step2': 'Elegí "Agregar a pantalla de inicio"',
    'install.ios.close': 'Entendido',
    'intro.logo': 'Logo Panini',
    'intro.emblem': 'Emblema',
    'intro.emblemVariant': 'Emblema · variante',
    'intro.mascots': 'Mascotas',
    'intro.slogan': 'Eslogan',
    'intro.ball': 'Pelota',
    'intro.host.canada': 'Sedes · Canadá',
    'intro.host.mexico': 'Sedes · México',
    'intro.host.usa': 'Sedes · EE.UU.',
    'museum.italy1934': 'Italia 1934',
    'museum.uruguay1950': 'Uruguay 1950',
    'museum.westGermany1954': 'Alemania F. 1954',
    'museum.brazil1962': 'Brasil 1962',
    'museum.westGermany1974': 'Alemania F. 1974',
    'museum.argentina1986': 'Argentina 1986',
    'museum.brazil1994': 'Brasil 1994',
    'museum.brazil2002': 'Brasil 2002',
    'museum.italy2006': 'Italia 2006',
    'museum.germany2014': 'Alemania 2014',
    'museum.argentina2022': 'Argentina 2022',
    'sync.title': 'Sincronización',
    'sync.code.label': 'Tu código',
    'sync.code.copy': 'Copiar',
    'sync.code.copied': '¡Copiado!',
    'sync.link.label': 'Vincular otro dispositivo',
    'sync.link.placeholder': 'XXXX-XXXX',
    'sync.link.button': 'Vincular',
    'sync.link.linked': '¡Vinculado!',
    'sync.link.notfound': 'Código no encontrado',
    'sync.status.syncing': 'Sincronizando...',
    'sync.status.synced': 'Sincronizado',
    'sync.status.error': 'Sin conexión',
    'sync.info': 'Ingresá este código en otro dispositivo para compartir tu progreso.',
  },
  en: {
    'loading': 'LOADING ALBUM...',
    'home.brand.album': 'ALBUM',
    'home.brand.location': 'World Cup · USA · Mexico · Canada',
    'home.reset.aria': 'Reset',
    'home.progress': 'PROGRESS',
    'home.stats.collected': 'stuck',
    'home.stats.missing': 'missing',
    'home.stats.dupes': 'dupes',
    'home.action.search': 'Search',
    'home.action.search.sub': 'by name or team',
    'home.action.repes': 'My dupes',
    'home.action.repes.sub.has': 'to trade',
    'home.action.repes.sub.empty': 'none yet',
    'home.sections': 'ALBUM SECTIONS',
    'home.autosave': 'AUTO-SAVED',
    'home.welcome.title': 'Start your album!',
    'home.welcome.body': 'Pick a section on the left to see the stickers.',
    'section.intro.title': 'FWC',
    'section.intro.sub': 'Trophy, mascot, stadiums',
    'section.teams.title': 'Teams',
    'section.teams.sub': '48 nations · 12 groups',
    'section.museum.title': 'FWC',
    'section.museum.sub': 'Champions through history',
    'section.coca.title': 'Coca-Cola Extras',
    'section.coca.sub': 'Not counted in the 980',
    'section.bonus.badge': 'BONUS',
    'simplegrid.intro.sub': 'Logo, emblems, mascots, hosts',
    'simplegrid.coca.sub': '12 exclusive stickers',
    'group': 'GROUP',
    'page': 'PG.',
    'header.back': 'Back',
    'team.back': 'Teams',
    'team.weAre': 'WE ARE',
    'team.complete': 'COMPLETE ✓',
    'team.repe': 'dupe',
    'team.repesPlural': 'dupes',
    'team.repesPanel': 'DUPES TO TRADE',
    'sticker.escudo': 'CREST',
    'sticker.equipo': 'TEAM',
    'sticker.namePlaceholder': 'name',
    'modal.figurita': 'STICKER',
    'modal.placeholder': 'Player name',
    'modal.cancel': 'Cancel',
    'modal.save': 'Save',
    'modal.lastFigurita': 'LAST STICKER',
    'modal.saveAndAdvance': 'SAVE AND CONTINUE',
    'search.back': 'Home',
    'search.placeholder': 'Name, country, FIFA code, number...',
    'search.howTo': 'HOW TO SEARCH',
    'search.howTo.player': 'player',
    'search.howTo.country': 'country',
    'search.howTo.fifaCode': 'FIFA code',
    'search.howTo.number': 'number',
    'search.howTo.year': 'year (Museum)',
    'search.howTo.byLabel': 'By',
    'search.empty.title': 'No results',
    'search.empty.sub': 'Try another name, country or code',
    'search.result': 'RESULT',
    'search.results': 'RESULTS',
    'search.tapHint.add': 'TAP A RESULT TO ADD',
    'search.tapHint.sub': 'TAP A RESULT TO SUBTRACT',
    'result.noName': '(no name)',
    'result.missing': 'MISSING',
    'repes.label': 'TO TRADE',
    'repes.title': 'My dupes',
    'repes.figRepeated': 'duplicate sticker',
    'repes.figRepeatedPlural': 'duplicate stickers',
    'repes.distinct': 'distinct sticker',
    'repes.distinctPlural': 'distinct stickers',
    'repes.in': 'across',
    'repes.ofStuck': 'of stuck stickers',
    'repes.empty.title': 'No dupes yet',
    'repes.empty.sub': 'When you have a sticker more than once, it will show up here so you can keep track when trading.',
    'repes.tapHint.add': 'TAP TO ADD · SWITCH MODE ABOVE',
    'repes.tapHint.sub': 'TAP TO SUBTRACT · SWITCH MODE ABOVE',
    'pageNav.prev': 'PREVIOUS',
    'pageNav.next': 'NEXT',
    'mode.add': 'Add',
    'mode.sub': 'Subtract',
    'legend.title': 'HOW TO USE',
    'legend.tap': 'Tap a sticker to mark / increment it',
    'legend.swap.before': 'Switch to',
    'legend.swap.after': 'to remove dupes',
    'legend.dupes': 'The yellow number shows how many dupes you have',
    'legend.editName.before': 'Tap',
    'legend.editName.after': 'below a player to write their name',
    'reset.title': 'Delete everything?',
    'reset.body': 'You will lose all your album progress. This cannot be undone.',
    'reset.cancel': 'Cancel',
    'reset.confirm': 'Delete all',
    'lang.picker': 'Language',
    'install.button': 'Install app',
    'install.subtitle': 'Keep it on your home screen',
    'install.ios.title': 'Install on iPhone',
    'install.ios.step1': 'Tap the Share button',
    'install.ios.step2': 'Choose "Add to Home Screen"',
    'install.ios.close': 'Got it',
    'intro.logo': 'Panini Logo',
    'intro.emblem': 'Emblem',
    'intro.emblemVariant': 'Emblem · variant',
    'intro.mascots': 'Mascots',
    'intro.slogan': 'Slogan',
    'intro.ball': 'Match Ball',
    'intro.host.canada': 'Hosts · Canada',
    'intro.host.mexico': 'Hosts · Mexico',
    'intro.host.usa': 'Hosts · USA',
    'museum.italy1934': 'Italy 1934',
    'museum.uruguay1950': 'Uruguay 1950',
    'museum.westGermany1954': 'West Germany 1954',
    'museum.brazil1962': 'Brazil 1962',
    'museum.westGermany1974': 'West Germany 1974',
    'museum.argentina1986': 'Argentina 1986',
    'museum.brazil1994': 'Brazil 1994',
    'museum.brazil2002': 'Brazil 2002',
    'museum.italy2006': 'Italy 2006',
    'museum.germany2014': 'Germany 2014',
    'museum.argentina2022': 'Argentina 2022',
    'sync.title': 'Sync',
    'sync.code.label': 'Your code',
    'sync.code.copy': 'Copy',
    'sync.code.copied': 'Copied!',
    'sync.link.label': 'Link another device',
    'sync.link.placeholder': 'XXXX-XXXX',
    'sync.link.button': 'Link',
    'sync.link.linked': 'Linked!',
    'sync.link.notfound': 'Code not found',
    'sync.status.syncing': 'Syncing...',
    'sync.status.synced': 'Synced',
    'sync.status.error': 'Offline',
    'sync.info': 'Enter this code on another device to share your progress.',
  },
  fr: {
    'loading': 'CHARGEMENT...',
    'home.brand.album': 'ALBUM',
    'home.brand.location': 'Coupe du Monde · USA · Mexique · Canada',
    'home.reset.aria': 'Réinitialiser',
    'home.progress': 'PROGRESSION',
    'home.stats.collected': 'collées',
    'home.stats.missing': 'manquantes',
    'home.stats.dupes': 'doubles',
    'home.action.search': 'Rechercher',
    'home.action.search.sub': 'par nom ou équipe',
    'home.action.repes': 'Mes doubles',
    'home.action.repes.sub.has': 'à échanger',
    'home.action.repes.sub.empty': 'aucun pour l\'instant',
    'home.sections': 'SECTIONS DE L\'ALBUM',
    'home.autosave': 'SAUVEGARDE AUTOMATIQUE',
    'home.welcome.title': 'Démarre ton album !',
    'home.welcome.body': 'Choisis une section à gauche pour voir les vignettes.',
    'section.intro.title': 'FWC',
    'section.intro.sub': 'Trophée, mascotte, stades',
    'section.teams.title': 'Équipes',
    'section.teams.sub': '48 nations · 12 groupes',
    'section.museum.title': 'FWC',
    'section.museum.sub': 'Champions de l\'histoire',
    'section.coca.title': 'Extras Coca-Cola',
    'section.coca.sub': 'Pas comptées dans les 980',
    'section.bonus.badge': 'BONUS',
    'simplegrid.intro.sub': 'Logo, emblèmes, mascottes, sites',
    'simplegrid.coca.sub': '12 vignettes exclusives',
    'group': 'GROUPE',
    'page': 'P.',
    'header.back': 'Retour',
    'team.back': 'Équipes',
    'team.weAre': 'WE ARE',
    'team.complete': 'COMPLÈTE ✓',
    'team.repe': 'double',
    'team.repesPlural': 'doubles',
    'team.repesPanel': 'DOUBLES À ÉCHANGER',
    'sticker.escudo': 'ÉCUSSON',
    'sticker.equipo': 'ÉQUIPE',
    'sticker.namePlaceholder': 'nom',
    'modal.figurita': 'VIGNETTE',
    'modal.placeholder': 'Nom du joueur',
    'modal.cancel': 'Annuler',
    'modal.save': 'Enregistrer',
    'modal.lastFigurita': 'DERNIÈRE VIGNETTE',
    'modal.saveAndAdvance': 'ENREGISTRER ET CONTINUER',
    'search.back': 'Accueil',
    'search.placeholder': 'Nom, pays, code FIFA, numéro...',
    'search.howTo': 'COMMENT CHERCHER',
    'search.howTo.player': 'joueur',
    'search.howTo.country': 'pays',
    'search.howTo.fifaCode': 'code FIFA',
    'search.howTo.number': 'numéro',
    'search.howTo.year': 'année (Musée)',
    'search.howTo.byLabel': 'Par',
    'search.empty.title': 'Aucun résultat',
    'search.empty.sub': 'Essayez un autre nom, pays ou code',
    'search.result': 'RÉSULTAT',
    'search.results': 'RÉSULTATS',
    'search.tapHint.add': 'TOUCHEZ UN RÉSULTAT POUR AJOUTER',
    'search.tapHint.sub': 'TOUCHEZ UN RÉSULTAT POUR SOUSTRAIRE',
    'result.noName': '(sans nom)',
    'result.missing': 'MANQUE',
    'repes.label': 'À ÉCHANGER',
    'repes.title': 'Mes doubles',
    'repes.figRepeated': 'vignette en double',
    'repes.figRepeatedPlural': 'vignettes en double',
    'repes.distinct': 'vignette différente',
    'repes.distinctPlural': 'vignettes différentes',
    'repes.in': 'sur',
    'repes.ofStuck': 'sur les vignettes collées',
    'repes.empty.title': 'Pas encore de doubles',
    'repes.empty.sub': 'Quand vous aurez une vignette plus d\'une fois, elle apparaîtra ici pour faciliter vos échanges.',
    'repes.tapHint.add': 'TOUCHEZ POUR AJOUTER · CHANGEZ DE MODE EN HAUT',
    'repes.tapHint.sub': 'TOUCHEZ POUR SOUSTRAIRE · CHANGEZ DE MODE EN HAUT',
    'pageNav.prev': 'PRÉCÉDENT',
    'pageNav.next': 'SUIVANT',
    'mode.add': 'Ajouter',
    'mode.sub': 'Soustraire',
    'legend.title': 'COMMENT UTILISER',
    'legend.tap': 'Touchez une vignette pour la marquer / l\'incrémenter',
    'legend.swap.before': 'Passez en',
    'legend.swap.after': 'pour retirer les doubles',
    'legend.dupes': 'Le numéro jaune indique le nombre de doubles',
    'legend.editName.before': 'Touchez',
    'legend.editName.after': 'sous le joueur pour écrire son nom',
    'reset.title': 'Tout effacer ?',
    'reset.body': 'Vous allez perdre toute votre progression. Cette action est irréversible.',
    'reset.cancel': 'Annuler',
    'reset.confirm': 'Tout effacer',
    'lang.picker': 'Langue',
    'install.button': 'Installer l\'app',
    'install.subtitle': 'Gardez-la sur votre écran d\'accueil',
    'install.ios.title': 'Installer sur iPhone',
    'install.ios.step1': 'Touchez le bouton Partager',
    'install.ios.step2': 'Choisissez "Sur l\'écran d\'accueil"',
    'install.ios.close': 'Compris',
    'intro.logo': 'Logo Panini',
    'intro.emblem': 'Emblème',
    'intro.emblemVariant': 'Emblème · variante',
    'intro.mascots': 'Mascottes',
    'intro.slogan': 'Slogan',
    'intro.ball': 'Ballon officiel',
    'intro.host.canada': 'Hôtes · Canada',
    'intro.host.mexico': 'Hôtes · Mexique',
    'intro.host.usa': 'Hôtes · États-Unis',
    'museum.italy1934': 'Italie 1934',
    'museum.uruguay1950': 'Uruguay 1950',
    'museum.westGermany1954': 'RFA 1954',
    'museum.brazil1962': 'Brésil 1962',
    'museum.westGermany1974': 'RFA 1974',
    'museum.argentina1986': 'Argentine 1986',
    'museum.brazil1994': 'Brésil 1994',
    'museum.brazil2002': 'Brésil 2002',
    'museum.italy2006': 'Italie 2006',
    'museum.germany2014': 'Allemagne 2014',
    'museum.argentina2022': 'Argentine 2022',
    'sync.title': 'Synchronisation',
    'sync.code.label': 'Ton code',
    'sync.code.copy': 'Copier',
    'sync.code.copied': 'Copié !',
    'sync.link.label': 'Lier un autre appareil',
    'sync.link.placeholder': 'XXXX-XXXX',
    'sync.link.button': 'Lier',
    'sync.link.linked': 'Lié !',
    'sync.link.notfound': 'Code introuvable',
    'sync.status.syncing': 'Synchronisation...',
    'sync.status.synced': 'Synchronisé',
    'sync.status.error': 'Hors ligne',
    'sync.info': 'Entre ce code sur un autre appareil pour partager ta progression.',
  },
  it: {
    'loading': 'CARICAMENTO ALBUM...',
    'home.brand.album': 'ALBUM',
    'home.brand.location': 'Mondiali · USA · Messico · Canada',
    'home.reset.aria': 'Reimposta',
    'home.progress': 'PROGRESSO',
    'home.stats.collected': 'attaccate',
    'home.stats.missing': 'mancanti',
    'home.stats.dupes': 'doppioni',
    'home.action.search': 'Cerca',
    'home.action.search.sub': 'per nome o squadra',
    'home.action.repes': 'I miei doppioni',
    'home.action.repes.sub.has': 'da scambiare',
    'home.action.repes.sub.empty': 'ancora niente',
    'home.sections': 'SEZIONI DELL\'ALBUM',
    'home.autosave': 'SALVATAGGIO AUTOMATICO',
    'home.welcome.title': 'Inizia il tuo album!',
    'home.welcome.body': 'Scegli una sezione a sinistra per vedere le figurine.',
    'section.intro.title': 'FWC',
    'section.intro.sub': 'Trofeo, mascotte, stadi',
    'section.teams.title': 'Squadre',
    'section.teams.sub': '48 nazionali · 12 gironi',
    'section.museum.title': 'FWC',
    'section.museum.sub': 'Campioni della storia',
    'section.coca.title': 'Extra Coca-Cola',
    'section.coca.sub': 'Non contano nelle 980',
    'section.bonus.badge': 'BONUS',
    'simplegrid.intro.sub': 'Logo, emblemi, mascotte, sedi',
    'simplegrid.coca.sub': '12 figurine esclusive',
    'group': 'GIRONE',
    'page': 'P.',
    'header.back': 'Indietro',
    'team.back': 'Squadre',
    'team.weAre': 'WE ARE',
    'team.complete': 'COMPLETA ✓',
    'team.repe': 'doppione',
    'team.repesPlural': 'doppioni',
    'team.repesPanel': 'DOPPIONI DA SCAMBIARE',
    'sticker.escudo': 'STEMMA',
    'sticker.equipo': 'SQUADRA',
    'sticker.namePlaceholder': 'nome',
    'modal.figurita': 'FIGURINA',
    'modal.placeholder': 'Nome del giocatore',
    'modal.cancel': 'Annulla',
    'modal.save': 'Salva',
    'modal.lastFigurita': 'ULTIMA FIGURINA',
    'modal.saveAndAdvance': 'SALVA E AVANZA',
    'search.back': 'Home',
    'search.placeholder': 'Nome, paese, codice FIFA, numero...',
    'search.howTo': 'COME CERCARE',
    'search.howTo.player': 'giocatore',
    'search.howTo.country': 'paese',
    'search.howTo.fifaCode': 'codice FIFA',
    'search.howTo.number': 'numero',
    'search.howTo.year': 'anno (Museo)',
    'search.howTo.byLabel': 'Per',
    'search.empty.title': 'Nessun risultato',
    'search.empty.sub': 'Prova con un altro nome, paese o codice',
    'search.result': 'RISULTATO',
    'search.results': 'RISULTATI',
    'search.tapHint.add': 'TOCCA UN RISULTATO PER AGGIUNGERE',
    'search.tapHint.sub': 'TOCCA UN RISULTATO PER SOTTRARRE',
    'result.noName': '(senza nome)',
    'result.missing': 'MANCA',
    'repes.label': 'DA SCAMBIARE',
    'repes.title': 'I miei doppioni',
    'repes.figRepeated': 'figurina doppia',
    'repes.figRepeatedPlural': 'figurine doppie',
    'repes.distinct': 'figurina diversa',
    'repes.distinctPlural': 'figurine diverse',
    'repes.in': 'su',
    'repes.ofStuck': 'sulle figurine attaccate',
    'repes.empty.title': 'Ancora nessun doppione',
    'repes.empty.sub': 'Quando avrai una figurina più di una volta, comparirà qui per averla a portata di mano per gli scambi.',
    'repes.tapHint.add': 'TOCCA PER AGGIUNGERE · CAMBIA MODO IN ALTO',
    'repes.tapHint.sub': 'TOCCA PER SOTTRARRE · CAMBIA MODO IN ALTO',
    'pageNav.prev': 'PRECEDENTE',
    'pageNav.next': 'SUCCESSIVO',
    'mode.add': 'Aggiungi',
    'mode.sub': 'Sottrai',
    'legend.title': 'COME SI USA',
    'legend.tap': 'Tocca una figurina per segnarla / aggiungerla',
    'legend.swap.before': 'Passa a',
    'legend.swap.after': 'per togliere doppioni',
    'legend.dupes': 'Il numero giallo indica quanti doppioni hai',
    'legend.editName.before': 'Tocca',
    'legend.editName.after': 'sotto il giocatore per scrivere come si chiama',
    'reset.title': 'Cancellare tutto?',
    'reset.body': 'Perderai tutti i progressi dell\'album. Questa azione non è reversibile.',
    'reset.cancel': 'Annulla',
    'reset.confirm': 'Cancella tutto',
    'lang.picker': 'Lingua',
    'install.button': 'Installa l\'app',
    'install.subtitle': 'Tienila a portata sulla schermata Home',
    'install.ios.title': 'Installa su iPhone',
    'install.ios.step1': 'Tocca il pulsante Condividi',
    'install.ios.step2': 'Scegli "Aggiungi a Home"',
    'install.ios.close': 'Ho capito',
    'intro.logo': 'Logo Panini',
    'intro.emblem': 'Emblema',
    'intro.emblemVariant': 'Emblema · variante',
    'intro.mascots': 'Mascotte',
    'intro.slogan': 'Slogan',
    'intro.ball': 'Pallone ufficiale',
    'intro.host.canada': 'Sedi · Canada',
    'intro.host.mexico': 'Sedi · Messico',
    'intro.host.usa': 'Sedi · USA',
    'museum.italy1934': 'Italia 1934',
    'museum.uruguay1950': 'Uruguay 1950',
    'museum.westGermany1954': 'Germania O. 1954',
    'museum.brazil1962': 'Brasile 1962',
    'museum.westGermany1974': 'Germania O. 1974',
    'museum.argentina1986': 'Argentina 1986',
    'museum.brazil1994': 'Brasile 1994',
    'museum.brazil2002': 'Brasile 2002',
    'museum.italy2006': 'Italia 2006',
    'museum.germany2014': 'Germania 2014',
    'museum.argentina2022': 'Argentina 2022',
    'sync.title': 'Sincronizzazione',
    'sync.code.label': 'Il tuo codice',
    'sync.code.copy': 'Copia',
    'sync.code.copied': 'Copiato!',
    'sync.link.label': 'Collega un altro dispositivo',
    'sync.link.placeholder': 'XXXX-XXXX',
    'sync.link.button': 'Collega',
    'sync.link.linked': 'Collegato!',
    'sync.link.notfound': 'Codice non trovato',
    'sync.status.syncing': 'Sincronizzando...',
    'sync.status.synced': 'Sincronizzato',
    'sync.status.error': 'Offline',
    'sync.info': 'Inserisci questo codice su un altro dispositivo per condividere i progressi.',
  },
  pt: {
    'loading': 'CARREGANDO ÁLBUM...',
    'home.brand.album': 'ÁLBUM',
    'home.brand.location': 'Copa do Mundo · EUA · México · Canadá',
    'home.reset.aria': 'Reiniciar',
    'home.progress': 'PROGRESSO',
    'home.stats.collected': 'coladas',
    'home.stats.missing': 'faltam',
    'home.stats.dupes': 'repetidas',
    'home.action.search': 'Buscar',
    'home.action.search.sub': 'por nome ou seleção',
    'home.action.repes': 'Minhas repetidas',
    'home.action.repes.sub.has': 'para trocar',
    'home.action.repes.sub.empty': 'ainda nada',
    'home.sections': 'SEÇÕES DO ÁLBUM',
    'home.autosave': 'SALVO AUTOMATICAMENTE',
    'home.welcome.title': 'Comece seu álbum!',
    'home.welcome.body': 'Escolha uma seção à esquerda para ver as figurinhas.',
    'section.intro.title': 'FWC',
    'section.intro.sub': 'Troféu, mascote, estádios',
    'section.teams.title': 'Seleções',
    'section.teams.sub': '48 seleções · 12 grupos',
    'section.museum.title': 'FWC',
    'section.museum.sub': 'Campeões da história',
    'section.coca.title': 'Extras Coca-Cola',
    'section.coca.sub': 'Não contam nas 980',
    'section.bonus.badge': 'BÔNUS',
    'simplegrid.intro.sub': 'Logo, emblemas, mascotes, sedes',
    'simplegrid.coca.sub': '12 figurinhas exclusivas',
    'group': 'GRUPO',
    'page': 'PÁG.',
    'header.back': 'Voltar',
    'team.back': 'Seleções',
    'team.weAre': 'WE ARE',
    'team.complete': 'COMPLETO ✓',
    'team.repe': 'repetida',
    'team.repesPlural': 'repetidas',
    'team.repesPanel': 'REPETIDAS PARA TROCAR',
    'sticker.escudo': 'ESCUDO',
    'sticker.equipo': 'EQUIPE',
    'sticker.namePlaceholder': 'nome',
    'modal.figurita': 'FIGURINHA',
    'modal.placeholder': 'Nome do jogador',
    'modal.cancel': 'Cancelar',
    'modal.save': 'Salvar',
    'modal.lastFigurita': 'ÚLTIMA FIGURINHA',
    'modal.saveAndAdvance': 'SALVAR E AVANÇAR',
    'search.back': 'Início',
    'search.placeholder': 'Nome, país, código FIFA, número...',
    'search.howTo': 'COMO BUSCAR',
    'search.howTo.player': 'jogador',
    'search.howTo.country': 'país',
    'search.howTo.fifaCode': 'código FIFA',
    'search.howTo.number': 'número',
    'search.howTo.year': 'ano (Museu)',
    'search.howTo.byLabel': 'Por',
    'search.empty.title': 'Sem resultados',
    'search.empty.sub': 'Tente outro nome, país ou código',
    'search.result': 'RESULTADO',
    'search.results': 'RESULTADOS',
    'search.tapHint.add': 'TOQUE NUM RESULTADO PARA SOMAR',
    'search.tapHint.sub': 'TOQUE NUM RESULTADO PARA SUBTRAIR',
    'result.noName': '(sem nome)',
    'result.missing': 'FALTA',
    'repes.label': 'PARA TROCAR',
    'repes.title': 'Minhas repetidas',
    'repes.figRepeated': 'figurinha repetida',
    'repes.figRepeatedPlural': 'figurinhas repetidas',
    'repes.distinct': 'figurinha distinta',
    'repes.distinctPlural': 'figurinhas distintas',
    'repes.in': 'em',
    'repes.ofStuck': 'sobre as coladas',
    'repes.empty.title': 'Ainda não tem repetidas',
    'repes.empty.sub': 'Quando tiver uma figurinha mais de uma vez, ela vai aparecer aqui para você ter à mão na hora da troca.',
    'repes.tapHint.add': 'TOQUE PARA SOMAR · MUDE O MODO ACIMA',
    'repes.tapHint.sub': 'TOQUE PARA SUBTRAIR · MUDE O MODO ACIMA',
    'pageNav.prev': 'ANTERIOR',
    'pageNav.next': 'SEGUINTE',
    'mode.add': 'Somar',
    'mode.sub': 'Subtrair',
    'legend.title': 'COMO USAR',
    'legend.tap': 'Toque uma figurinha para marcá-la / somar',
    'legend.swap.before': 'Mude para',
    'legend.swap.after': 'para tirar repetidas',
    'legend.dupes': 'O número amarelo indica quantas repetidas você tem',
    'legend.editName.before': 'Toque',
    'legend.editName.after': 'embaixo do jogador para escrever o nome dele',
    'reset.title': 'Apagar tudo?',
    'reset.body': 'Você vai perder todo o seu progresso do álbum. Esta ação não pode ser desfeita.',
    'reset.cancel': 'Cancelar',
    'reset.confirm': 'Apagar tudo',
    'lang.picker': 'Idioma',
    'install.button': 'Instalar app',
    'install.subtitle': 'Tenha à mão na sua tela inicial',
    'install.ios.title': 'Instalar no iPhone',
    'install.ios.step1': 'Toque no botão Compartilhar',
    'install.ios.step2': 'Escolha "Adicionar à Tela de Início"',
    'install.ios.close': 'Entendi',
    'intro.logo': 'Logo Panini',
    'intro.emblem': 'Emblema',
    'intro.emblemVariant': 'Emblema · variante',
    'intro.mascots': 'Mascotes',
    'intro.slogan': 'Slogan',
    'intro.ball': 'Bola oficial',
    'intro.host.canada': 'Sedes · Canadá',
    'intro.host.mexico': 'Sedes · México',
    'intro.host.usa': 'Sedes · EUA',
    'museum.italy1934': 'Itália 1934',
    'museum.uruguay1950': 'Uruguai 1950',
    'museum.westGermany1954': 'Alemanha Oc. 1954',
    'museum.brazil1962': 'Brasil 1962',
    'museum.westGermany1974': 'Alemanha Oc. 1974',
    'museum.argentina1986': 'Argentina 1986',
    'museum.brazil1994': 'Brasil 1994',
    'museum.brazil2002': 'Brasil 2002',
    'museum.italy2006': 'Itália 2006',
    'museum.germany2014': 'Alemanha 2014',
    'museum.argentina2022': 'Argentina 2022',
    'sync.title': 'Sincronização',
    'sync.code.label': 'Seu código',
    'sync.code.copy': 'Copiar',
    'sync.code.copied': 'Copiado!',
    'sync.link.label': 'Vincular outro dispositivo',
    'sync.link.placeholder': 'XXXX-XXXX',
    'sync.link.button': 'Vincular',
    'sync.link.linked': 'Vinculado!',
    'sync.link.notfound': 'Código não encontrado',
    'sync.status.syncing': 'Sincronizando...',
    'sync.status.synced': 'Sincronizado',
    'sync.status.error': 'Sem conexão',
    'sync.info': 'Digite este código em outro dispositivo para compartilhar seu progresso.',
  },
};

const COUNTRY_NAMES = {
  ALG: { es: 'Argelia',         en: 'Algeria',           fr: 'Algérie',           it: 'Algeria',          pt: 'Argélia' },
  ARG: { es: 'Argentina',       en: 'Argentina',         fr: 'Argentine',         it: 'Argentina',        pt: 'Argentina' },
  AUS: { es: 'Australia',       en: 'Australia',         fr: 'Australie',         it: 'Australia',        pt: 'Austrália' },
  AUT: { es: 'Austria',         en: 'Austria',           fr: 'Autriche',          it: 'Austria',          pt: 'Áustria' },
  BEL: { es: 'Bélgica',         en: 'Belgium',           fr: 'Belgique',          it: 'Belgio',           pt: 'Bélgica' },
  BIH: { es: 'Bosnia y Herz.',  en: 'Bosnia & Herz.',    fr: 'Bosnie-Herz.',      it: 'Bosnia Erz.',      pt: 'Bósnia & Herz.' },
  BRA: { es: 'Brasil',          en: 'Brazil',            fr: 'Brésil',            it: 'Brasile',          pt: 'Brasil' },
  CAN: { es: 'Canadá',          en: 'Canada',            fr: 'Canada',            it: 'Canada',           pt: 'Canadá' },
  CIV: { es: 'Costa de Marfil', en: 'Ivory Coast',       fr: 'Côte d\'Ivoire',    it: 'Costa d\'Avorio',  pt: 'Costa do Marfim' },
  COD: { es: 'RD Congo',        en: 'DR Congo',          fr: 'RD Congo',          it: 'RD Congo',         pt: 'RD Congo' },
  COL: { es: 'Colombia',        en: 'Colombia',          fr: 'Colombie',          it: 'Colombia',         pt: 'Colômbia' },
  CPV: { es: 'Cabo Verde',      en: 'Cape Verde',        fr: 'Cap-Vert',          it: 'Capo Verde',       pt: 'Cabo Verde' },
  CRO: { es: 'Croacia',         en: 'Croatia',           fr: 'Croatie',           it: 'Croazia',          pt: 'Croácia' },
  CUW: { es: 'Curazao',         en: 'Curaçao',           fr: 'Curaçao',           it: 'Curaçao',          pt: 'Curaçao' },
  CZE: { es: 'Chequia',         en: 'Czechia',           fr: 'Tchéquie',          it: 'Cechia',           pt: 'Chéquia' },
  ECU: { es: 'Ecuador',         en: 'Ecuador',           fr: 'Équateur',          it: 'Ecuador',          pt: 'Equador' },
  EGY: { es: 'Egipto',          en: 'Egypt',             fr: 'Égypte',            it: 'Egitto',           pt: 'Egito' },
  ENG: { es: 'Inglaterra',      en: 'England',           fr: 'Angleterre',        it: 'Inghilterra',      pt: 'Inglaterra' },
  ESP: { es: 'España',          en: 'Spain',             fr: 'Espagne',           it: 'Spagna',           pt: 'Espanha' },
  FRA: { es: 'Francia',         en: 'France',            fr: 'France',            it: 'Francia',          pt: 'França' },
  GER: { es: 'Alemania',        en: 'Germany',           fr: 'Allemagne',         it: 'Germania',         pt: 'Alemanha' },
  GHA: { es: 'Ghana',           en: 'Ghana',             fr: 'Ghana',             it: 'Ghana',            pt: 'Gana' },
  HAI: { es: 'Haití',           en: 'Haiti',             fr: 'Haïti',             it: 'Haiti',            pt: 'Haiti' },
  IRN: { es: 'Irán',            en: 'Iran',              fr: 'Iran',              it: 'Iran',             pt: 'Irã' },
  IRQ: { es: 'Irak',            en: 'Iraq',              fr: 'Irak',              it: 'Iraq',             pt: 'Iraque' },
  JOR: { es: 'Jordania',        en: 'Jordan',            fr: 'Jordanie',          it: 'Giordania',        pt: 'Jordânia' },
  JPN: { es: 'Japón',           en: 'Japan',             fr: 'Japon',             it: 'Giappone',         pt: 'Japão' },
  KOR: { es: 'Corea del Sur',   en: 'South Korea',       fr: 'Corée du Sud',      it: 'Corea del Sud',    pt: 'Coreia do Sul' },
  KSA: { es: 'Arabia Saudita',  en: 'Saudi Arabia',      fr: 'Arabie saoudite',   it: 'Arabia Saudita',   pt: 'Arábia Saudita' },
  MAR: { es: 'Marruecos',       en: 'Morocco',           fr: 'Maroc',             it: 'Marocco',          pt: 'Marrocos' },
  MEX: { es: 'México',          en: 'Mexico',            fr: 'Mexique',           it: 'Messico',          pt: 'México' },
  NED: { es: 'Países Bajos',    en: 'Netherlands',       fr: 'Pays-Bas',          it: 'Paesi Bassi',      pt: 'Países Baixos' },
  NOR: { es: 'Noruega',         en: 'Norway',            fr: 'Norvège',           it: 'Norvegia',         pt: 'Noruega' },
  NZL: { es: 'Nueva Zelanda',   en: 'New Zealand',       fr: 'Nouvelle-Zélande',  it: 'Nuova Zelanda',    pt: 'Nova Zelândia' },
  PAN: { es: 'Panamá',          en: 'Panama',            fr: 'Panama',            it: 'Panama',           pt: 'Panamá' },
  PAR: { es: 'Paraguay',        en: 'Paraguay',          fr: 'Paraguay',          it: 'Paraguay',         pt: 'Paraguai' },
  POR: { es: 'Portugal',        en: 'Portugal',          fr: 'Portugal',          it: 'Portogallo',       pt: 'Portugal' },
  QAT: { es: 'Catar',           en: 'Qatar',             fr: 'Qatar',             it: 'Qatar',            pt: 'Catar' },
  RSA: { es: 'Sudáfrica',       en: 'South Africa',      fr: 'Afrique du Sud',    it: 'Sudafrica',        pt: 'África do Sul' },
  SCO: { es: 'Escocia',         en: 'Scotland',          fr: 'Écosse',            it: 'Scozia',           pt: 'Escócia' },
  SEN: { es: 'Senegal',         en: 'Senegal',           fr: 'Sénégal',           it: 'Senegal',          pt: 'Senegal' },
  SUI: { es: 'Suiza',           en: 'Switzerland',       fr: 'Suisse',            it: 'Svizzera',         pt: 'Suíça' },
  SWE: { es: 'Suecia',          en: 'Sweden',            fr: 'Suède',             it: 'Svezia',           pt: 'Suécia' },
  TUN: { es: 'Túnez',           en: 'Tunisia',           fr: 'Tunisie',           it: 'Tunisia',          pt: 'Tunísia' },
  TUR: { es: 'Turquía',         en: 'Türkiye',           fr: 'Turquie',           it: 'Turchia',          pt: 'Turquia' },
  URU: { es: 'Uruguay',         en: 'Uruguay',           fr: 'Uruguay',           it: 'Uruguay',          pt: 'Uruguai' },
  USA: { es: 'EE.UU.',          en: 'USA',               fr: 'États-Unis',        it: 'USA',              pt: 'EUA' },
  UZB: { es: 'Uzbekistán',      en: 'Uzbekistan',        fr: 'Ouzbékistan',       it: 'Uzbekistan',       pt: 'Uzbequistão' },
};

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch (e) {}
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const navLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(navLang) ? navLang : DEFAULT_LANG;
}

const LangContext = React.createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (k) => k,
  countryName: (code) => code,
});

function useLang() {
  return React.useContext(LangContext);
}

// Lookup all teams flat
const ALL_TEAMS = GROUPS.flatMap(g => TEAMS_BY_GROUP[g].map(t => ({ ...t, group: g })));
const TEAM_BY_CODE = Object.fromEntries(ALL_TEAMS.map(t => [t.code, t]));

// =========================
// ALBUM PAGE ORDER (for prev/next page navigation)
// =========================
const ALL_PAGES = [
  { type: 'simple', section: 'INTRO', labelKey: 'section.intro.title', subtitleKey: 'pageNav.album' },
  ...ALL_TEAMS.map((t) => ({
    type: 'team',
    code: t.code,
    group: t.group,
  })),
  { type: 'simple', section: 'MUSEUM', labelKey: 'section.museum.title' },
  { type: 'simple', section: 'COCA',   labelKey: 'section.coca.title', subtitleKey: 'section.bonus.badge' },
];

function pageIndexOf(view) {
  if (!view) return -1;
  if (view.type === 'simple') return ALL_PAGES.findIndex(p => p.type === 'simple' && p.section === view.section);
  if (view.type === 'team') return ALL_PAGES.findIndex(p => p.type === 'team' && p.code === view.code);
  return -1;
}

function pageNeighbor(view, delta) {
  const i = pageIndexOf(view);
  if (i < 0) return null;
  const n = ALL_PAGES.length;
  const next = ((i + delta) % n + n) % n;
  return ALL_PAGES[next];
}

function viewFromPage(p) {
  return p.type === 'team'
    ? { type: 'team', code: p.code }
    : { type: 'simple', section: p.section };
}


// Luminance helper: light backgrounds (yellow teams etc.) need dark text
function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55;
}
function textOn(hex) {
  return isLightColor(hex) ? '#0F0F12' : '#FFFFFF';
}

// =========================
// HELPERS
// =========================
function stickerLabel(idx) {
  // For sections that don't have team-photo positions (INTRO/MUSEUM/COCA)
  return `#${String(idx).padStart(2, '0')}`;
}

// Resolve a player's display name: user override → official Panini default → empty
function resolveName(id, namesMap) {
  return (namesMap && namesMap[id]) || DEFAULT_NAMES[id] || '';
}


// =========================
// SEARCH / REPES HELPERS
// =========================
function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function allStickers(counts, names, t, countryName) {
  const out = [];
  const introTitle  = t('section.intro.title');
  const museumTitle = t('section.museum.title');
  const cocaTitle   = t('section.coca.title');
  const groupWord   = t('group');
  // Introducción
  INTRO_INFO.forEach((info, i) => {
    const id = `INTRO-${i + 1}`;
    const label = t(info.labelKey);
    out.push({
      id,
      key: 'intro',
      sectionTitle: introTitle,
      sectionSort: 0,
      number: i,
      label,
      flag: info.flag,
      code: info.code,
      flagCode: info.code,
      accent: info.accent,
      count: counts[id] || 0,
      searchable: normalize(`${label} ${info.code} ${introTitle} fwc intro introduccion introduction introduzione introducao`),
    });
  });
  // Museum (album numbers continue from INTRO: 9..19)
  MUSEUM_INFO.forEach((info, i) => {
    const id = `MUSEUM-${i + 1}`;
    const label = t(info.labelKey);
    out.push({
      id,
      key: 'museum',
      sectionTitle: museumTitle,
      sectionSort: 1,
      number: i + INTRO_COUNT,
      label,
      flag: info.flag,
      code: info.code,
      flagCode: info.countryCode || info.code,
      accent: info.accent,
      count: counts[id] || 0,
      searchable: normalize(`${label} ${info.code} ${museumTitle} fwc museo museum musee museu fifa campeon champion`),
    });
  });
  // Teams (by groups, in album order)
  GROUPS.forEach((g, gi) => {
    TEAMS_BY_GROUP[g].forEach((tm, ti) => {
      const teamName = countryName(tm.code);
      for (let i = 1; i <= 20; i++) {
        const id = `${tm.code}-${i}`;
        const isPlayer = i !== 1 && i !== 13;
        const label =
          i === 1 ? t('sticker.escudo')
          : i === 13 ? t('sticker.equipo')
          : (names[id] || DEFAULT_NAMES[id] || '');
        out.push({
          id,
          key: 'team',
          team: { ...tm, name: teamName },
          group: g,
          sectionTitle: `${groupWord} ${g} · ${teamName}`,
          sectionSort: 100 + gi * 10 + ti,
          number: i,
          label,
          flag: tm.flag,
          code: tm.code,
          flagCode: tm.code,
          accent: tm.color,
          isPlayer,
          count: counts[id] || 0,
          searchable: normalize(`${label} ${teamName} ${tm.name} ${tm.code} ${groupWord} ${g} grupo group groupe girone #${i} ${i}`),
        });
      }
    });
  });
  // Coca-Cola
  COCA_INFO.forEach((info, i) => {
    const id = `COCA-${i + 1}`;
    out.push({
      id,
      key: 'coca',
      sectionTitle: cocaTitle,
      sectionSort: 1000,
      number: i + 1,
      label: info.label,
      flag: info.flag,
      code: info.code,
      flagCode: info.code,
      accent: info.accent,
      count: counts[id] || 0,
      searchable: normalize(`${info.label} ${info.code} coca cola coca-cola`),
    });
  });
  return out;
}

function viewForStickerId(id) {
  if (id.startsWith('INTRO-')) return { type: 'simple', section: 'INTRO' };
  if (id.startsWith('MUSEUM-')) return { type: 'simple', section: 'MUSEUM' };
  if (id.startsWith('COCA-')) return { type: 'simple', section: 'COCA' };
  const code = id.split('-')[0];
  if (TEAM_BY_CODE[code]) return { type: 'team', code };
  return { type: 'home' };
}

// =========================
// FIREBASE SYNC UTILS
// =========================
function generateSyncCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[arr[i] % chars.length];
  return s.slice(0, 4) + '-' + s.slice(4);
}

function rawCode(code) { return code.replace('-', ''); }

async function cloudPush(code, counts, names) {
  const url = `${FIREBASE_DB}/syncs/${rawCode(code)}.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counts, names, _ts: Date.now() }),
  });
  if (!res.ok) throw new Error('push failed');
}

async function cloudPull(code) {
  const url = `${FIREBASE_DB}/syncs/${rawCode(code)}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('pull failed');
  return res.json();
}

// =========================
// MAIN APP
// =========================
export default function App() {
  const [counts, setCounts] = useState({});
  const [names, setNames] = useState({});
  const [view, setView] = useState({ type: 'home' });
  const [mode, setMode] = useState('add'); // 'add' or 'sub'
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [editingId, setEditingId] = useState(null); // sticker id being renamed
  const [lang, setLangState] = useState(() => detectLang());
  const [syncCode, setSyncCode] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle'|'syncing'|'synced'|'error'
  const [showSyncPanel, setShowSyncPanel] = useState(false);
  const syncTimerRef = useRef(null);

  const setLang = useCallback((newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    setLangState(newLang);
    try { localStorage.setItem(LANG_KEY, newLang); } catch (e) {}
  }, []);

  const t = useCallback((key) => {
    return (T[lang] && T[lang][key]) || T[DEFAULT_LANG][key] || key;
  }, [lang]);

  const countryName = useCallback((code) => {
    return (COUNTRY_NAMES[code] && COUNTRY_NAMES[code][lang]) || (TEAM_BY_CODE[code]?.name) || code;
  }, [lang]);

  const langCtx = useMemo(() => ({ lang, setLang, t, countryName }), [lang, setLang, t, countryName]);

  // Load on mount: localStorage first (instant), then merge from cloud if newer
  useEffect(() => {
    let localCounts = {};
    let localNames = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localCounts = JSON.parse(raw);
    } catch (e) {}
    try {
      const raw = localStorage.getItem(NAMES_KEY);
      if (raw) localNames = JSON.parse(raw);
    } catch (e) {}
    setCounts(localCounts);
    setNames(localNames);
    setLoaded(true);

    let code = localStorage.getItem(SYNC_CODE_KEY);
    if (!code) {
      code = generateSyncCode();
      localStorage.setItem(SYNC_CODE_KEY, code);
    }
    setSyncCode(code);

    const localTs = parseInt(localStorage.getItem(SYNC_TS_KEY) || '0', 10);
    setSyncStatus('syncing');
    cloudPull(code).then(cloud => {
      if (cloud && cloud._ts && cloud._ts > localTs) {
        const nc = cloud.counts || {};
        const nn = cloud.names || {};
        setCounts(nc);
        setNames(nn);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nc));
          localStorage.setItem(NAMES_KEY, JSON.stringify(nn));
          localStorage.setItem(SYNC_TS_KEY, String(cloud._ts));
        } catch (e) {}
      }
      setSyncStatus('synced');
    }).catch(() => setSyncStatus('error'));
  }, []);

  // Save counts on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    } catch (e) {
      console.error('Save failed', e);
    }
  }, [counts, loaded]);

  // Save names on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(NAMES_KEY, JSON.stringify(names));
    } catch (e) {
      console.error('Save failed', e);
    }
  }, [names, loaded]);

  // Debounced cloud push on any data change
  useEffect(() => {
    if (!loaded || !syncCode) return;
    setSyncStatus('syncing');
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      cloudPush(syncCode, counts, names)
        .then(() => {
          setSyncStatus('synced');
          try { localStorage.setItem(SYNC_TS_KEY, String(Date.now())); } catch (e) {}
        })
        .catch(() => setSyncStatus('error'));
    }, 1500);
  }, [counts, names, loaded, syncCode]);

  const updateName = useCallback((id, value) => {
    setNames(prev => {
      const updated = { ...prev };
      const trimmed = (value || '').trim();
      if (!trimmed) delete updated[id];
      else updated[id] = trimmed;
      return updated;
    });
  }, []);

  const updateSticker = useCallback((id, delta) => {
    setCounts(prev => {
      const cur = prev[id] || 0;
      const next = Math.max(0, cur + delta);
      const updated = { ...prev };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  }, []);

  const handleStickerTap = useCallback((id) => {
    updateSticker(id, mode === 'add' ? +1 : -1);
  }, [mode, updateSticker]);

  const resetAll = useCallback(() => {
    setCounts({});
    setNames({});
    setConfirmReset(false);
    if (history.state?.modal) history.back();
  }, []);

  const linkToCode = useCallback(async (newCode) => {
    const code = newCode.trim().toUpperCase();
    if (rawCode(code).length !== 8) return 'invalid';
    setSyncStatus('syncing');
    try {
      const cloud = await cloudPull(code);
      if (!cloud || cloud._ts == null) return 'notfound';
      const nc = cloud.counts || {};
      const nn = cloud.names || {};
      setCounts(nc);
      setNames(nn);
      setSyncCode(code);
      try {
        localStorage.setItem(SYNC_CODE_KEY, code);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nc));
        localStorage.setItem(NAMES_KEY, JSON.stringify(nn));
        localStorage.setItem(SYNC_TS_KEY, String(cloud._ts));
      } catch (e) {}
      setSyncStatus('synced');
      return 'ok';
    } catch (e) {
      setSyncStatus('error');
      return 'error';
    }
  }, []);

  // ---- History-API navigation ----
  // Each user-meaningful screen state is one history entry, so the OS / browser
  // back button (and the in-app "Volver") behave the same.
  const navigate = useCallback((newView) => {
    history.pushState({ view: newView, modal: null }, '');
    setView(newView);
    setEditingId(null);
    setConfirmReset(false);
  }, []);

  const replaceView = useCallback((newView) => {
    // Used for prev/next paging within the album: swaps the current entry
    // instead of growing the back stack, so back returns to where you came from.
    history.replaceState({ view: newView, modal: null }, '');
    setView(newView);
  }, []);

  const goBack = useCallback(() => {
    history.back();
  }, []);

  const openEditModal = useCallback((stickerId) => {
    history.pushState({ view, modal: { type: 'edit', stickerId } }, '');
    setEditingId(stickerId);
  }, [view]);

  const advanceEditModal = useCallback((stickerId) => {
    history.replaceState({ view, modal: { type: 'edit', stickerId } }, '');
    setEditingId(stickerId);
  }, [view]);

  const closeEditModal = useCallback(() => {
    if (history.state?.modal?.type === 'edit') history.back();
    else setEditingId(null);
  }, []);

  const openConfirmReset = useCallback(() => {
    history.pushState({ view, modal: { type: 'reset' } }, '');
    setConfirmReset(true);
  }, [view]);

  const closeConfirmReset = useCallback(() => {
    if (history.state?.modal?.type === 'reset') history.back();
    else setConfirmReset(false);
  }, []);

  // Initial replaceState + popstate listener
  useEffect(() => {
    if (!history.state) {
      history.replaceState({ view: { type: 'home' }, modal: null }, '');
    }
    const onPop = (e) => {
      const s = e.state || { view: { type: 'home' }, modal: null };
      setView(s.view || { type: 'home' });
      setEditingId(s.modal?.type === 'edit' ? s.modal.stickerId : null);
      setConfirmReset(s.modal?.type === 'reset');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    let unique = 0;
    let totalWithDupes = 0;
    let dupes = 0;
    Object.entries(counts).forEach(([id, c]) => {
      // Don't count Coca-Cola in the base 980
      if (id.startsWith('COCA-')) return;
      if (c > 0) {
        unique += 1;
        totalWithDupes += c;
        dupes += c - 1;
      }
    });
    return { unique, totalWithDupes, dupes, missing: TOTAL_BASE - unique };
  }, [counts]);

  const sectionStats = useMemo(() => {
    function countSection(prefix, total) {
      let c = 0;
      let dupes = 0;
      for (let i = 1; i <= total; i++) {
        const v = counts[`${prefix}-${i}`] || 0;
        if (v > 0) c++;
        if (v > 1) dupes += v - 1;
      }
      return { collected: c, total, dupes };
    }
    let teamsCollected = 0;
    let teamsDupes = 0;
    GROUPS.forEach(g => {
      TEAMS_BY_GROUP[g].forEach(t => {
        for (let i = 1; i <= 20; i++) {
          const v = counts[`${t.code}-${i}`] || 0;
          if (v > 0) teamsCollected++;
          if (v > 1) teamsDupes += v - 1;
        }
      });
    });
    return {
      intro: countSection('INTRO', INTRO_COUNT),
      museum: countSection('MUSEUM', MUSEUM_COUNT),
      coca: countSection('COCA', COCA_COUNT),
      teams: { collected: teamsCollected, total: 48 * 20, dupes: teamsDupes },
    };
  }, [counts]);

  function teamStats(code) {
    let collected = 0;
    let dupes = 0;
    for (let i = 1; i <= 20; i++) {
      const v = counts[`${code}-${i}`] || 0;
      if (v > 0) collected++;
      if (v > 1) dupes += v - 1;
    }
    return { collected, total: 20, dupes };
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-400 font-mono-special text-sm tracking-widest">{t('loading')}</div>
      </div>
    );
  }

  const pct = Math.round((stats.unique / TOTAL_BASE) * 100);
  const dupesPct = stats.unique > 0 ? Math.round((stats.dupes / stats.unique) * 100) : 0;

  return (
    <LangContext.Provider value={langCtx}>
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Outer wrapper: mobile = single column, desktop = centered two-column block */}
      <div className="lg:flex lg:min-h-screen lg:max-w-5xl lg:mx-auto">

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto bg-white border-r border-stone-100">
            <HomeSidebar
              pct={pct}
              dupesPct={dupesPct}
              stats={stats}
              sectionStats={sectionStats}
              onNavigate={navigate}
              onResetClick={openConfirmReset}
              activeView={view}
              syncCode={syncCode}
              syncStatus={syncStatus}
              showSyncPanel={showSyncPanel}
              setShowSyncPanel={setShowSyncPanel}
              onLinkCode={linkToCode}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 pb-20">
        <div className="max-w-md md:max-w-xl mx-auto lg:mx-0 lg:max-w-none relative">
          {/* Decorative pattern background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ctext x='0' y='42' font-family='Helvetica,Arial,sans-serif' font-weight='900' font-size='38' fill='%23000'%3E26%3C/text%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative">
            {view.type === 'home' && (
              <>
                {/* Mobile: full home view */}
                <div className="lg:hidden">
                  <HomeView
                    pct={pct}
                    dupesPct={dupesPct}
                    stats={stats}
                    sectionStats={sectionStats}
                    onNavigate={navigate}
                    onResetClick={openConfirmReset}
                    syncStatus={syncStatus}
                    onSyncClick={() => setShowSyncPanel(true)}
                  />
                </div>
                {/* Desktop: welcome placeholder */}
                <div className="hidden lg:flex min-h-screen items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-24 h-24 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
                      <span className="font-display text-4xl text-rose-600">26</span>
                    </div>
                    <div className="font-display text-2xl text-stone-700 mb-2">{t('home.welcome.title')}</div>
                    <div className="text-stone-400 text-sm max-w-xs mx-auto leading-relaxed">{t('home.welcome.body')}</div>
                  </div>
                </div>
              </>
            )}
            {view.type === 'simple' && (
              <SimpleGridView
                section={view.section}
                counts={counts}
                mode={mode}
                setMode={setMode}
                onStickerTap={handleStickerTap}
                onBack={goBack}
                currentView={view}
                onReplaceView={replaceView}
              />
            )}
            {view.type === 'groups' && (
              <GroupsView
                counts={counts}
                teamStats={teamStats}
                onTeamSelect={(code) => navigate({ type: 'team', code })}
                onBack={goBack}
              />
            )}
            {view.type === 'team' && (
              <TeamView
                code={view.code}
                counts={counts}
                names={names}
                mode={mode}
                setMode={setMode}
                onStickerTap={handleStickerTap}
                onEditName={openEditModal}
                onBack={goBack}
                currentView={view}
                onReplaceView={replaceView}
              />
            )}
            {view.type === 'search' && (
              <SearchView
                counts={counts}
                names={names}
                mode={mode}
                setMode={setMode}
                onStickerTap={handleStickerTap}
                onResultNavigate={(id) => setView(viewForStickerId(id))}
                onBack={goBack}
              />
            )}
            {view.type === 'repes' && (
              <RepesView
                counts={counts}
                names={names}
                mode={mode}
                setMode={setMode}
                onStickerTap={handleStickerTap}
                onBack={goBack}
              />
            )}
          </div>
        </div>
        </div>
      </div>

      {confirmReset && (
        <ConfirmReset onCancel={closeConfirmReset} onConfirm={resetAll} />
      )}

      {editingId && (
        <NameEditModal
          stickerId={editingId}
          currentName={resolveName(editingId, names)}
          onCancel={closeEditModal}
          onSave={(value) => {
            updateName(editingId, value);
            closeEditModal();
          }}
          onSaveAndNext={(value) => {
            updateName(editingId, value);
            // Advance to next player sticker on the same team if possible
            const m = editingId.match(/^([A-Z]{3})-(\d+)$/);
            if (m) {
              const code = m[1];
              let num = parseInt(m[2], 10);
              // Find next player slot, skipping 1 (escudo) and 13 (team photo)
              while (num < 20) {
                num += 1;
                if (num !== 13) {
                  advanceEditModal(`${code}-${num}`);
                  return;
                }
              }
            }
            closeEditModal();
          }}
        />
      )}

      {showSyncPanel && (
        <SyncPanel
          syncCode={syncCode}
          syncStatus={syncStatus}
          onLinkCode={linkToCode}
          onClose={() => setShowSyncPanel(false)}
        />
      )}
    </div>
    </LangContext.Provider>
  );
}


// =========================
// SYNC ICON
// =========================
function SyncIcon({ status, size = 16 }) {
  if (status === 'syncing') return <Loader2 size={size} className="animate-spin text-stone-400" />;
  if (status === 'synced')  return <Cloud size={size} className="text-emerald-500" />;
  if (status === 'error')   return <CloudOff size={size} className="text-rose-400" />;
  return <Cloud size={size} className="text-stone-300" />;
}

// =========================
// SYNC PANEL
// =========================
function SyncPanel({ syncCode, syncStatus, onLinkCode, onClose }) {
  const { t } = useLang();
  const [inputCode, setInputCode] = useState('');
  const [linkState, setLinkState] = useState('idle'); // 'idle'|'loading'|'ok'|'notfound'|'error'
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(syncCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleLink = async () => {
    if (!inputCode.trim()) return;
    setLinkState('loading');
    const result = await onLinkCode(inputCode);
    setLinkState(result === 'ok' ? 'ok' : result === 'notfound' ? 'notfound' : 'error');
    if (result === 'ok') setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-3xl p-6 panini-shadow max-w-sm w-full">
        <div className="flex items-center justify-between mb-5">
          <div className="font-display text-xl">{t('sync.title')}</div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1"><X size={18} /></button>
        </div>

        {/* Current code */}
        <div className="mb-5">
          <div className="font-mono-special text-[10px] tracking-widest text-stone-400 mb-2">{t('sync.code.label')}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-stone-100 rounded-xl px-4 py-3 font-mono-special text-xl tracking-widest text-stone-800 text-center">
              {syncCode}
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 bg-stone-900 text-white rounded-xl px-3 py-3 flex items-center gap-1.5"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="font-display text-sm">{copied ? t('sync.code.copied') : t('sync.code.copy')}</span>
            </button>
          </div>
          <div className="text-[11px] text-stone-400 mt-2 leading-relaxed">{t('sync.info')}</div>
        </div>

        {/* Link another device */}
        <div className="border-t border-stone-100 pt-5">
          <div className="font-mono-special text-[10px] tracking-widest text-stone-400 mb-2">{t('sync.link.label')}</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={e => { setInputCode(e.target.value.toUpperCase()); setLinkState('idle'); }}
              placeholder={t('sync.link.placeholder')}
              maxLength={9}
              className="flex-1 bg-stone-100 rounded-xl px-4 py-3 font-mono-special text-sm tracking-widest outline-none focus:ring-2 focus:ring-stone-300"
            />
            <button
              onClick={handleLink}
              disabled={linkState === 'loading' || linkState === 'ok'}
              className="flex-shrink-0 bg-stone-900 text-white rounded-xl px-4 py-3 font-display text-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {linkState === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
              {t('sync.link.button')}
            </button>
          </div>
          {linkState === 'ok' && (
            <div className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><Check size={14} />{t('sync.link.linked')}</div>
          )}
          {linkState === 'notfound' && (
            <div className="text-rose-500 text-sm mt-2">{t('sync.link.notfound')}</div>
          )}
          {linkState === 'error' && (
            <div className="text-rose-500 text-sm mt-2">{t('sync.status.error')}</div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100">
          <SyncIcon status={syncStatus} size={14} />
          <span className="text-[11px] text-stone-400 font-mono-special">
            {t(`sync.status.${syncStatus === 'idle' ? 'syncing' : syncStatus}`)}
          </span>
        </div>
      </div>
    </div>
  );
}

// =========================
// HOME SIDEBAR (desktop only)
// =========================
function HomeSidebar({ pct, dupesPct, stats, sectionStats, onNavigate, onResetClick, activeView, syncCode, syncStatus, showSyncPanel, setShowSyncPanel, onLinkCode }) {
  const { t } = useLang();

  const sections = [
    { key: 'intro',  title: t('section.intro.title'),  sub: t('section.intro.sub'),   icon: <Sparkles size={15} />, accent: '#1E40AF', view: { type: 'simple', section: 'INTRO' } },
    { key: 'teams',  title: t('section.teams.title'),  sub: t('section.teams.sub'),   icon: <Users size={15} />,    accent: '#E11D48', view: { type: 'groups' } },
    { key: 'museum', title: t('section.museum.title'), sub: t('section.museum.sub'),  icon: <Trophy size={15} />,   accent: '#F59E0B', view: { type: 'simple', section: 'MUSEUM' } },
    { key: 'coca',   title: t('section.coca.title'),   sub: t('section.coca.sub'),    icon: <Star size={15} />,     accent: '#DC2626', view: { type: 'simple', section: 'COCA' }, extra: true },
  ];

  return (
    <div className="flex flex-col h-full px-5 py-6">
      {/* Brand row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="font-display text-2xl leading-none text-left"
        >
          {t('home.brand.album')} <span className="text-rose-600">26</span>
        </button>
        <div className="flex items-center gap-0.5">
          <InstallPrompt />
          <LangPicker />
          <button
            onClick={onResetClick}
            className="text-stone-400 hover:text-stone-600 p-2"
            aria-label={t('home.reset.aria')}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-stone-50 rounded-2xl p-4 mb-4">
        <div className="font-mono-special text-[9px] tracking-[0.25em] text-stone-400 mb-1">{t('home.progress')}</div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <div className="font-display text-5xl leading-none">{pct}</div>
          <div className="font-display text-xl text-stone-400">%</div>
          <div className="font-mono-special text-sm text-stone-400 ml-1">{stats.unique}<span className="text-stone-300">/{TOTAL_BASE}</span></div>
        </div>
        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          <StatCell icon={<Check size={12} />} value={stats.unique} label={t('home.stats.collected')} tone="emerald" />
          <StatCell icon={<Hash size={12} />} value={stats.missing} label={t('home.stats.missing')} tone="rose" />
          <StatCell icon={<Flame size={12} />} value={stats.dupes} label={t('home.stats.dupes')} tone="amber" sub={stats.unique > 0 ? `${dupesPct}%` : null} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => onNavigate({ type: 'search' })}
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors text-left ${activeView.type === 'search' ? 'bg-stone-900 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
        >
          <Search size={14} className="flex-shrink-0" />
          <span className="font-display text-sm">{t('home.action.search')}</span>
        </button>
        <button
          onClick={() => onNavigate({ type: 'repes' })}
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors text-left ${activeView.type === 'repes' ? 'bg-amber-400 text-stone-900' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
        >
          <Flame size={14} className="flex-shrink-0" />
          <span className="font-display text-sm">{t('home.action.repes')}</span>
          {stats.dupes > 0 && <span className="font-mono-special text-[10px] opacity-60">{stats.dupes}</span>}
        </button>
      </div>

      {/* Section nav */}
      <div className="font-mono-special text-[9px] tracking-[0.25em] text-stone-400 mb-2">{t('home.sections')}</div>
      <div className="space-y-0.5 flex-1">
        {sections.map(sec => {
          const ss = sectionStats[sec.key];
          const secPct = ss.total > 0 ? Math.round((ss.collected / ss.total) * 100) : 0;
          const isActive = activeView.type === sec.view.type &&
            (sec.view.type !== 'simple' || activeView.section === sec.view.section);
          return (
            <button
              key={sec.key}
              onClick={() => onNavigate(sec.view)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors text-left ${isActive ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: sec.accent }}
              >
                {sec.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm leading-tight flex items-center gap-1.5">
                  {sec.title}
                  {sec.extra && (
                    <span className="text-[8px] font-mono-special tracking-widest bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                      BONUS
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-stone-400 truncate">{sec.sub}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono-special text-xs font-bold">{ss.collected}<span className="text-stone-300">/{ss.total}</span></div>
                <div className="text-[9px] text-stone-300 font-mono-special">{secPct}%</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sync footer */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <button
          onClick={() => setShowSyncPanel(true)}
          className="w-full flex items-center justify-between rounded-xl px-3 py-2 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SyncIcon status={syncStatus} size={14} />
            <span className="font-mono-special text-[10px] text-stone-400 tracking-wider">
              {t(`sync.status.${syncStatus === 'idle' ? 'syncing' : syncStatus}`)}
            </span>
          </div>
          {syncCode && (
            <span className="font-mono-special text-[10px] text-stone-300">{syncCode}</span>
          )}
        </button>
      </div>
    </div>
  );
}


// =========================
// HOME VIEW
// =========================
function HomeView({ pct, dupesPct, stats, sectionStats, onNavigate, onResetClick, syncStatus, onSyncClick }) {
  const { t } = useLang();
  return (
    <div className="px-4 pt-6">
      {/* Top brand */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-display text-3xl leading-none">{t('home.brand.album')} <span className="text-rose-600">26</span></div>
          <div className="text-xs text-stone-500 mt-1">{t('home.brand.location')}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onSyncClick}
            className="text-stone-400 hover:text-stone-600 p-2"
            aria-label={t('sync.title')}
            title={t(`sync.status.${syncStatus === 'idle' ? 'syncing' : syncStatus}`)}
          >
            <SyncIcon status={syncStatus} size={18} />
          </button>
          <InstallPrompt />
          <LangPicker />
          <button
            onClick={onResetClick}
            className="text-stone-400 hover:text-stone-600 p-2"
            aria-label={t('home.reset.aria')}
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Big progress card */}
      <div className="bg-white rounded-3xl panini-shadow p-6 mb-4 relative overflow-hidden">
        <div
          className="absolute -right-8 -top-8 font-display text-[180px] text-rose-600/[0.06] leading-none select-none pointer-events-none"
        >
          26
        </div>
        <div className="relative">
          <div className="font-mono-special text-[10px] tracking-[0.25em] text-stone-500">{t('home.progress')}</div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="font-display text-7xl leading-none text-stone-900">{pct}</div>
            <div className="font-display text-3xl text-stone-400">%</div>
          </div>
          <div className="font-mono-special text-sm text-stone-600 mt-1">
            {stats.unique} <span className="text-stone-400">/ {TOTAL_BASE}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-stone-100 rounded-full mt-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* 3 stat cells */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <StatCell icon={<Check size={14} />} value={stats.unique} label={t('home.stats.collected')} tone="emerald" />
            <StatCell icon={<Hash size={14} />} value={stats.missing} label={t('home.stats.missing')} tone="rose" />
            <StatCell icon={<Flame size={14} />} value={stats.dupes} label={t('home.stats.dupes')} tone="amber" sub={stats.unique > 0 ? `${dupesPct}%` : null} />
          </div>
        </div>
      </div>

      {/* Quick actions: Buscar & Mis repes */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => onNavigate({ type: 'search' })}
          className="bg-white rounded-2xl panini-shadow p-3 flex items-center gap-2.5 active:scale-[0.99] transition-transform text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
            <Search size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm leading-tight">{t('home.action.search')}</div>
            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{t('home.action.search.sub')}</div>
          </div>
        </button>
        <button
          onClick={() => onNavigate({ type: 'repes' })}
          className="bg-white rounded-2xl panini-shadow p-3 flex items-center gap-2.5 active:scale-[0.99] transition-transform text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
            <Flame size={16} className="text-stone-900" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm leading-tight">
              {t('home.action.repes')}{stats.dupes > 0 ? <span className="text-stone-400 font-mono-special font-normal"> · {stats.dupes}</span> : null}
            </div>
            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
              {stats.dupes > 0 ? `${t('home.action.repes.sub.has')} · ${dupesPct}%` : t('home.action.repes.sub.empty')}
            </div>
          </div>
        </button>
      </div>

      {/* Sections */}
      <div className="font-mono-special text-[10px] tracking-[0.25em] text-stone-500 mt-6 mb-3 px-1">
        {t('home.sections')}
      </div>

      <div className="space-y-2">
        <SectionCard
          title={t('section.intro.title')}
          subtitle={t('section.intro.sub')}
          collected={sectionStats.intro.collected}
          total={sectionStats.intro.total}
          icon={<Sparkles size={18} />}
          accent="#1E40AF"
          onClick={() => onNavigate({ type: 'simple', section: 'INTRO' })}
        />
        <SectionCard
          title={t('section.teams.title')}
          subtitle={t('section.teams.sub')}
          collected={sectionStats.teams.collected}
          total={sectionStats.teams.total}
          icon={<Users size={18} />}
          accent="#E11D48"
          onClick={() => onNavigate({ type: 'groups' })}
          big
        />
        <SectionCard
          title={t('section.museum.title')}
          subtitle={t('section.museum.sub')}
          collected={sectionStats.museum.collected}
          total={sectionStats.museum.total}
          icon={<Trophy size={18} />}
          accent="#F59E0B"
          onClick={() => onNavigate({ type: 'simple', section: 'MUSEUM' })}
        />
        <SectionCard
          title={t('section.coca.title')}
          subtitle={t('section.coca.sub')}
          collected={sectionStats.coca.collected}
          total={sectionStats.coca.total}
          icon={<Star size={18} />}
          accent="#DC2626"
          onClick={() => onNavigate({ type: 'simple', section: 'COCA' })}
          extra
        />
      </div>

      <div className="text-center text-[11px] text-stone-400 mt-8 font-mono-special tracking-widest">
        {t('home.autosave')}
      </div>
    </div>
  );
}

function InstallPrompt() {
  const { t } = useLang();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [installed, setInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator.standalone === true) return true;
    return false;
  });

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  if (installed) return null;

  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  const canShow = !!deferredPrompt || isIOS;
  if (!canShow) return null;

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') setInstalled(true);
      } catch (e) {}
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-stone-400 hover:text-stone-700 active:text-stone-900 p-2"
        aria-label={t('install.button')}
        title={t('install.button')}
      >
        <Download size={18} />
      </button>
      {showIosModal && <IosInstallModal onClose={() => setShowIosModal(false)} isSafari={isSafari} />}
    </>
  );
}

function IosInstallModal({ onClose, isSafari }) {
  const { t } = useLang();
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-5 panini-shadow max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-lg">{t('install.ios.title')}</div>
          <button onClick={onClose} className="text-stone-400 active:text-stone-700 -mr-1 p-1">
            <X size={18} />
          </button>
        </div>
        <ol className="space-y-3 text-sm text-stone-700">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono-special text-xs flex-shrink-0">1</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span>{t('install.ios.step1')}</span>
              <Share size={16} className="text-stone-500" />
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono-special text-xs flex-shrink-0">2</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span>{t('install.ios.step2')}</span>
              <Plus size={16} className="text-stone-500" />
            </div>
          </li>
        </ol>
        {!isSafari && (
          <div className="mt-4 text-[11px] text-stone-500 bg-stone-100 rounded-xl px-3 py-2">
            ⚠️ Safari
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl bg-stone-900 text-white font-medium active:bg-stone-700"
        >
          {t('install.ios.close')}
        </button>
      </div>
    </div>
  );
}

function LangPicker() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-stone-500 hover:text-stone-900 p-2 flex items-center gap-1.5"
        aria-label={t('lang.picker')}
      >
        <FlagIcon code={`__lang_${lang}`} fallback={LANG_INFO[lang].flag} className="w-5 h-3.5 rounded-[1px] object-cover shadow-sm" />
        <span className="font-mono-special text-[10px] font-bold uppercase">{lang}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl panini-shadow z-30 min-w-[170px] py-1 overflow-hidden">
          {SUPPORTED_LANGS.map(code => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false); }}
              className={`w-full px-3 py-2 text-left flex items-center gap-2.5 text-sm active:bg-stone-100 ${
                code === lang ? 'bg-stone-100 font-semibold' : 'hover:bg-stone-50'
              }`}
            >
              <FlagIcon code={`__lang_${code}`} fallback={LANG_INFO[code].flag} className="w-6 h-4 rounded-[2px] object-cover shadow-sm" />
              <span className="flex-1">{LANG_INFO[code].label}</span>
              {code === lang && <Check size={14} className="text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCell({ icon, value, label, tone, sub }) {
  const toneMap = {
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className={`rounded-xl px-2 py-3 ${toneMap[tone]}`}>
      <div className="flex items-center gap-1 opacity-70">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <div className="font-mono-special text-xl font-bold">{value}</div>
        {sub && <div className="font-mono-special text-[10px] opacity-70">{sub}</div>}
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, collected, total, icon, accent, onClick, big, extra }) {
  const pct = total > 0 ? Math.round((collected / total) * 100) : 0;
  const done = collected === total && total > 0;
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl panini-shadow p-4 text-left active:scale-[0.99] transition-transform relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="rounded-xl w-10 h-10 flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: accent }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="font-display text-lg leading-tight flex items-center gap-2">
              {title}
              {done && <Check size={16} className="text-emerald-600" strokeWidth={3} />}
              {extra && (
                <span className="text-[9px] font-mono-special tracking-widest bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  BONUS
                </span>
              )}
            </div>
            <div className="text-xs text-stone-500 mt-0.5 truncate">{subtitle}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono-special text-base font-bold">{collected}<span className="text-stone-400">/{total}</span></div>
          <div className="text-[10px] text-stone-400 font-mono-special">{pct}%</div>
        </div>
      </div>
      {/* Bar */}
      <div className="h-1.5 bg-stone-100 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
    </button>
  );
}

// =========================
// SIMPLE GRID VIEW (Intro / Museum / Coca)
// =========================
function SimpleGridView({ section, counts, mode, setMode, onStickerTap, onBack, currentView, onReplaceView }) {
  const { t } = useLang();
  const config = {
    INTRO:  { title: t('section.intro.title'),  subtitle: t('simplegrid.intro.sub'), accent: '#1E40AF', data: INTRO_INFO },
    MUSEUM: { title: t('section.museum.title'), subtitle: t('section.museum.sub'),  accent: '#F59E0B', data: MUSEUM_INFO },
    COCA:   { title: t('section.coca.title'),   subtitle: t('simplegrid.coca.sub'), accent: '#DC2626', data: COCA_INFO },
  }[section];

  return (
    <div className="px-4 pt-4">
      <Header onBack={onBack} title={config.title} subtitle={config.subtitle} accent={config.accent} />
      <ModeToggle mode={mode} setMode={setMode} />

      <div className="mt-4 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2 gap-y-3">
        {config.data.map((info, i) => {
          const idx = i + 1;
          const id = `${section}-${idx}`;
          const count = counts[id] || 0;
          const label = info.labelKey ? t(info.labelKey) : info.label;
          // FWC numbering: INTRO 0..8, MUSEUM 9..19 (continues from intro)
          const displayNum =
            section === 'INTRO' ? i :
            section === 'MUSEUM' ? i + INTRO_COUNT :
            idx;
          return (
            <StickerCell
              key={id}
              number={displayNum}
              count={count}
              accent={info.accent}
              flag={info.flag}
              flagCode={info.countryCode || info.code}
              code={info.code}
              fixedLabel={label}
              isPlayer={false}
              onTap={() => onStickerTap(id)}
              onEditName={() => {}}
            />
          );
        })}
      </div>

      <PageNav currentView={currentView} onReplaceView={onReplaceView} />
      <Legend />
    </div>
  );
}

// =========================
// GROUPS VIEW (12 groups, all teams listed)
// =========================
function GroupsView({ counts, teamStats, onTeamSelect, onBack }) {
  const { t, countryName } = useLang();
  return (
    <div className="px-4 pt-4">
      <Header onBack={onBack} title={t('section.teams.title')} subtitle={t('section.teams.sub')} accent="#E11D48" />

      <div className="mt-4 space-y-5">
        {GROUPS.map(g => {
          const teams = TEAMS_BY_GROUP[g];
          const groupCollected = teams.reduce((s, tm) => s + teamStats(tm.code).collected, 0);
          const groupTotal = teams.length * 20;
          return (
            <div key={g}>
              <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex items-center gap-2">
                  <div className="font-display text-2xl text-stone-900 leading-none">{t('group')} {g}</div>
                </div>
                <div className="font-mono-special text-xs text-stone-500">
                  {groupCollected}<span className="text-stone-400">/{groupTotal}</span>
                </div>
              </div>
              <div className="space-y-2">
                {teams.map(tm => {
                  const ts = teamStats(tm.code);
                  const pct = Math.round((ts.collected / ts.total) * 100);
                  const done = ts.collected === ts.total;
                  return (
                    <button
                      key={tm.code}
                      onClick={() => onTeamSelect(tm.code)}
                      className="w-full bg-white rounded-2xl panini-shadow p-3 text-left active:scale-[0.99] transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        {/* Flag tile with team color border */}
                        <div
                          className="rounded-lg w-12 h-12 flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden"
                          style={{ backgroundColor: tm.color }}
                        >
                          <FlagIcon code={tm.code} fallback={tm.flag} className="w-7 h-5 rounded-[2px] object-cover shadow-sm" />
                          <div
                            className="font-mono-special text-[8px] tracking-widest mt-0.5 font-bold"
                            style={{ color: textOn(tm.color), opacity: 0.85 }}
                          >
                            {tm.code}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-display text-base leading-tight truncate">{countryName(tm.code)}</div>
                            <div className="font-mono-special text-sm font-bold flex-shrink-0">
                              {ts.collected}<span className="text-stone-400">/20</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-stone-100 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${pct}%`, backgroundColor: tm.color }}
                            />
                          </div>
                          {(ts.dupes > 0 || done) && (
                            <div className="flex items-center gap-2 mt-1.5">
                              {done && (
                                <div className="text-[10px] font-mono-special tracking-wider bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                                  {t('team.complete')}
                                </div>
                              )}
                              {ts.dupes > 0 && (
                                <div className="text-[10px] font-mono-special tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                  {ts.dupes} {ts.dupes === 1 ? t('team.repe') : t('team.repesPlural')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================
// TEAM VIEW (20 stickers)
// =========================
function TeamView({ code, counts, names, mode, setMode, onStickerTap, onEditName, onBack, currentView, onReplaceView }) {
  const { t, countryName } = useLang();
  const team = TEAM_BY_CODE[code];
  const teamLocalizedName = countryName(code);
  let collected = 0;
  let dupes = 0;
  for (let i = 1; i <= 20; i++) {
    const v = counts[`${code}-${i}`] || 0;
    if (v > 0) collected++;
    if (v > 1) dupes += v - 1;
  }
  const pct = Math.round((collected / 20) * 100);
  const onColor = textOn(team.color);
  const isLight = isLightColor(team.color);

  // List of "repes" sticker numbers for trade panel
  const repesList = [];
  for (let i = 1; i <= 20; i++) {
    const v = counts[`${code}-${i}`] || 0;
    if (v > 1) repesList.push({ n: i, count: v - 1, name: resolveName(`${code}-${i}`, names) });
  }

  return (
    <div className="px-4 pt-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-stone-500 active:text-stone-900 mb-3 -ml-1"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">{t('team.back')}</span>
      </button>

      {/* Album-style team header: WE ARE [COUNTRY] */}
      <div
        className="rounded-3xl panini-shadow relative overflow-hidden"
        style={{ backgroundColor: team.color, color: onColor }}
      >
        {/* Big code watermark */}
        <div
          className="absolute -right-4 -top-2 font-display text-[120px] leading-none select-none pointer-events-none"
          style={{ color: isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.10)' }}
        >
          {team.code}
        </div>

        <div className="relative p-5">
          <div className="font-mono-special text-[10px] tracking-[0.3em] opacity-70">
            {t('group')} {team.group}{team.page ? ` · ${t('page')} ${team.page}-${team.page + 1}` : ''}
          </div>
          <div
            className="font-display text-xs tracking-[0.3em] opacity-80 mt-2"
          >
            {t('team.weAre')}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="font-display text-3xl leading-none uppercase">{teamLocalizedName}</div>
            <FlagIcon code={team.code} fallback={team.flag} className="w-10 h-7 rounded-sm shadow-sm object-cover" />
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <div className="font-display text-4xl">{collected}</div>
            <div className="font-display text-2xl opacity-60">/ 20</div>
            <div className="font-mono-special text-sm opacity-70 ml-2">· {pct}%</div>
          </div>
          <div
            className="h-2 rounded-full mt-2 overflow-hidden"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.20)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: isLight ? '#0F0F12' : '#FFFFFF',
              }}
            />
          </div>
        </div>
      </div>

      <ModeToggle mode={mode} setMode={setMode} />

      {/* Sticker grid — album-style 4 columns with names underneath */}
      <div className="mt-4 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2 gap-y-3">
        {Array.from({ length: 20 }).map((_, i) => {
          const idx = i + 1;
          const id = `${code}-${idx}`;
          const count = counts[id] || 0;
          const isPlayer = idx !== 1 && idx !== 13;
          const fixedKind = idx === 1 ? 'escudo' : idx === 13 ? 'equipo' : null;
          const fixedLabel = fixedKind ? t(`sticker.${fixedKind}`) : null;
          const playerName = resolveName(id, names);
          const isCustomName = !!names[id];

          return (
            <StickerCell
              key={id}
              number={idx}
              count={count}
              accent={team.color}
              flag={team.flag}
              flagCode={team.code}
              code={team.code}
              fixedLabel={fixedLabel}
              fixedKind={fixedKind}
              playerName={playerName}
              isCustomName={isCustomName}
              isPlayer={isPlayer}
              onTap={() => onStickerTap(id)}
              onEditName={() => onEditName(id)}
            />
          );
        })}
      </div>

      {repesList.length > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-amber-700" />
            <div className="font-mono-special text-[10px] tracking-[0.2em] text-amber-800">
              {t('team.repesPanel')}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {repesList.map(r => (
              <div
                key={r.n}
                className="bg-white rounded-lg px-2 py-1 text-xs font-mono-special font-bold border border-amber-300"
              >
                #{r.n}
                {r.name && <span className="text-stone-600 font-normal ml-1">· {r.name}</span>}
                {r.count > 1 && <span className="text-amber-700 ml-1">×{r.count}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <PageNav currentView={currentView} onReplaceView={onReplaceView} />
      <Legend hasNames />
    </div>
  );
}


// =========================
// STICKER CELL — figurita-style when collected
// =========================
function StickerCell({ number, count, accent, flag, flagCode, code, fixedLabel, fixedKind, playerName, isCustomName, isPlayer, onTap, onEditName }) {
  const { t } = useLang();
  const collected = count > 0;
  const dupes = Math.max(0, count - 1);
  const onColor = collected ? textOn(accent) : '#A8A29E';
  const isLight = collected ? isLightColor(accent) : false;

  // Deterministic small rotation so each sticker looks hand-placed (-1.6 to +1.6 deg)
  const rot = collected ? (((number * 37) % 7) - 3) * 0.55 : 0;

  // The big "26" watermark inside the sticker uses an inverted alpha based on bg
  const watermarkColor = isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.18)';
  const subColor = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.75)';

  return (
    <div className="flex flex-col">
      {/* Sticker square */}
      <button
        onClick={onTap}
        className="relative aspect-square sticker-tap"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        {/* The "page slot" behind the sticker (visible when empty) */}
        {!collected && (
          <div
            className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#F5F5F4', border: '2px dashed #D6D3D1' }}
          >
            <div
              className="absolute top-1.5 left-1.5 font-mono-special text-[9px] font-bold"
              style={{ color: '#A8A29E' }}
            >
              {String(number).padStart(2, '0')}
            </div>
            <div className="font-display text-5xl" style={{ color: '#E7E5E4', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {String(number).padStart(2, '0')}
            </div>
          </div>
        )}

        {/* The actual figurita (visible when collected) */}
        {collected && (
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              backgroundColor: accent,
              boxShadow:
                '0 2px 5px -1px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.20)',
            }}
          >
            {/* Big "26" watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <span
                className="font-display"
                style={{
                  lineHeight: 1,
                  letterSpacing: '-0.06em',
                  color: watermarkColor,
                  fontVariantNumeric: 'tabular-nums',
                  transform: 'translateY(-2%)',
                  fontSize: '4.2rem',
                }}
              >
                {String(number).padStart(2, '0')}
              </span>
            </div>

            {/* Top-left number */}
            <div
              className="absolute top-1 left-1.5 font-mono-special text-[9px] font-bold tracking-tight"
              style={{ color: onColor, opacity: 0.92 }}
            >
              {String(number).padStart(2, '0')}
            </div>

            {/* Top-right flag (only if provided) */}
            {(flag || flagCode) && (
              <div className="absolute top-0.5 right-1 leading-none">
                <FlagIcon code={flagCode} fallback={flag} className="w-4 h-3 rounded-[1px] object-cover" />
              </div>
            )}

            {/* Bottom strip: FIFA code or category label */}
            <div
              className="absolute bottom-0 left-0 right-0 px-1.5 py-1 flex items-center justify-center"
              style={{
                background:
                  isLight ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.18)',
              }}
            >
              <span
                className="font-display text-[9px] tracking-[0.15em]"
                style={{ color: subColor }}
              >
                {fixedKind === 'escudo' || fixedKind === 'equipo' ? fixedLabel : code}
              </span>
            </div>

            {/* Diagonal shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.06) 100%)',
              }}
            />
          </div>
        )}

        {/* Dupe badge — outside so it isn't clipped */}
        {dupes > 0 && (
          <div className="absolute -top-1 -right-1 z-10 bg-amber-400 text-stone-900 text-[10px] font-bold rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center font-mono-special border-2 border-white shadow-sm">
            +{dupes}
          </div>
        )}
      </button>

      {/* Name strip below the figurita */}
      {fixedLabel ? (
        <div className="mt-1.5 text-center text-[10px] font-mono-special tracking-wider text-stone-500 uppercase truncate">
          {fixedLabel}
        </div>
      ) : (
        <button
          onClick={onEditName}
          className="mt-1.5 text-center min-h-[16px] active:bg-stone-100 rounded transition-colors px-0.5"
        >
          {playerName ? (
            <div
              className={`text-[11px] truncate leading-tight ${
                isCustomName ? 'font-semibold text-stone-900' : 'font-medium text-stone-700'
              }`}
            >
              {playerName}
            </div>
          ) : (
            <div className="text-[10px] text-stone-400 truncate flex items-center justify-center gap-0.5">
              <Pencil size={9} />
              <span>{t('sticker.namePlaceholder')}</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}

// =========================
// NAME EDIT MODAL
// =========================
function NameEditModal({ stickerId, currentName, onCancel, onSave, onSaveAndNext }) {
  const { t, countryName } = useLang();
  const [value, setValue] = useState(currentName);
  const inputRef = useRef(null);

  // Parse stickerId for display
  const m = stickerId.match(/^([A-Z]{3})-(\d+)$/);
  const team = m ? TEAM_BY_CODE[m[1]] : null;
  const num = m ? parseInt(m[2], 10) : 0;
  const isLastPlayer = num === 20;

  useEffect(() => {
    setValue(currentName);
    const t = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 80);
    return () => clearTimeout(t);
  }, [stickerId, currentName]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isLastPlayer) onSave(value);
      else onSaveAndNext(value);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!team) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl p-5 panini-shadow max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <FlagIcon code={team.code} fallback={team.flag} className="w-7 h-5 rounded-sm shadow-sm object-cover" />
            <div className="font-display text-base">{countryName(team.code)}</div>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 active:text-stone-700 -mr-1 p-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="font-mono-special text-[10px] tracking-[0.2em] text-stone-500">
          {t('modal.figurita')} #{String(num).padStart(2, '0')}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('modal.placeholder')}
          className="mt-4 w-full px-4 py-3 bg-stone-100 rounded-xl text-base font-medium outline-none focus:bg-stone-50 focus:ring-2 focus:ring-stone-300"
          autoComplete="off"
          autoCapitalize="words"
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-900 font-medium active:bg-stone-200"
          >
            {t('modal.cancel')}
          </button>
          {!isLastPlayer ? (
            <button
              onClick={() => onSaveAndNext(value)}
              className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-medium active:bg-stone-700 flex items-center justify-center gap-1.5"
            >
              {t('modal.save')}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => onSave(value)}
              className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-medium active:bg-stone-700"
            >
              {t('modal.save')}
            </button>
          )}
        </div>
        <div className="text-[11px] text-stone-400 text-center mt-2 font-mono-special">
          {isLastPlayer ? t('modal.lastFigurita') : t('modal.saveAndAdvance')}
        </div>
      </div>
    </div>
  );
}


// =========================
// RESULT ROW (used by Search and Repes)
// =========================
function ResultRow({ s, onTap }) {
  const { t } = useLang();
  const fg = textOn(s.accent);
  return (
    <button
      onClick={() => onTap(s.id)}
      className="w-full bg-white rounded-xl panini-shadow p-2.5 flex items-center gap-2.5 active:scale-[0.99] transition-transform"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
        style={{ backgroundColor: s.accent }}
      >
        {s.flagCode && FLAGS[s.flagCode] ? (
          <FlagIcon code={s.flagCode} className="w-6 h-4 rounded-[2px] object-cover shadow-sm" />
        ) : s.flag ? (
          <span className="text-lg leading-none">{s.flag}</span>
        ) : (
          <span className="font-display text-[9px] tracking-wider" style={{ color: fg }}>
            {s.code}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="font-medium text-[13px] leading-tight truncate text-stone-900">
          {s.label || <span className="text-stone-400">{t('result.noName')}</span>}
        </div>
        <div className="text-[10px] text-stone-500 truncate font-mono-special tracking-wider mt-0.5">
          {s.sectionTitle} · #{String(s.number).padStart(2, '0')}
        </div>
      </div>
      <div className="flex-shrink-0">
        {s.count === 0 ? (
          <span className="text-[10px] text-stone-400 font-mono-special tracking-wider">{t('result.missing')}</span>
        ) : s.count === 1 ? (
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="text-emerald-700" size={14} strokeWidth={3} />
          </div>
        ) : (
          <div className="bg-amber-400 text-stone-900 rounded-full px-2 py-1 text-xs font-mono-special font-bold leading-none">
            ×{s.count}
          </div>
        )}
      </div>
    </button>
  );
}

// =========================
// SEARCH VIEW
// =========================
function SearchView({ counts, names, mode, setMode, onStickerTap, onResultNavigate, onBack }) {
  const { t, lang, countryName } = useLang();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const to = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(to);
  }, []);

  const all = useMemo(() => allStickers(counts, names, t, countryName), [counts, names, lang, t, countryName]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return all.filter(s => s.searchable.includes(q)).slice(0, 200);
  }, [all, query]);

  const isEmpty = !query.trim();

  return (
    <div className="px-4 pt-4 pb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-stone-500 active:text-stone-900 mb-3 -ml-1"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">{t('search.back')}</span>
      </button>

      {/* Search input */}
      <div className="bg-white rounded-2xl panini-shadow p-2 flex items-center gap-2">
        <Search size={18} className="text-stone-400 ml-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 bg-transparent outline-none text-base py-2 min-w-0"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="text-stone-400 active:text-stone-700 p-1.5 mr-1 flex-shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <ModeToggle mode={mode} setMode={setMode} />

      {isEmpty ? (
        <div className="mt-6 px-1 text-stone-500">
          <div className="font-mono-special text-[10px] tracking-widest text-stone-400 mb-3">
            {t('search.howTo')}
          </div>
          <div className="space-y-2 text-[13px]">
            <div>• {t('search.howTo.byLabel')} <span className="font-medium text-stone-900">{t('search.howTo.player')}</span>: <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">Messi</span>, <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">Yamal</span></div>
            <div>• {t('search.howTo.byLabel')} <span className="font-medium text-stone-900">{t('search.howTo.country')}</span>: <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">{countryName('ARG')}</span>, <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">{countryName('BRA')}</span></div>
            <div>• {t('search.howTo.byLabel')} <span className="font-medium text-stone-900">{t('search.howTo.fifaCode')}</span>: <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">ARG</span>, <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">ESP</span></div>
            <div>• {t('search.howTo.byLabel')} <span className="font-medium text-stone-900">{t('search.howTo.number')}</span>: <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">17</span></div>
            <div>• {t('search.howTo.byLabel')} <span className="font-medium text-stone-900">{t('search.howTo.year')}</span>: <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">1986</span>, <span className="font-mono-special bg-stone-100 px-1.5 py-0.5 rounded">2022</span></div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8 text-center text-stone-500">
          <div className="text-4xl mb-2">😕</div>
          <div className="font-display text-lg">{t('search.empty.title')}</div>
          <div className="text-sm text-stone-400 mt-1">{t('search.empty.sub')}</div>
        </div>
      ) : (
        <>
          <div className="font-mono-special text-[10px] tracking-widest text-stone-400 mt-4 mb-2 px-1">
            {results.length} {results.length === 1 ? t('search.result') : t('search.results')}
          </div>
          <div className="space-y-1.5">
            {results.map(s => {
              return <ResultRow key={s.id} s={s} onTap={onStickerTap} />;
            })}
          </div>

          <div className="text-center text-[11px] text-stone-400 mt-6 font-mono-special tracking-widest">
            {mode === 'add' ? t('search.tapHint.add') : t('search.tapHint.sub')}
          </div>
        </>
      )}
    </div>
  );
}

// =========================
// REPES VIEW
// =========================
function RepesView({ counts, names, mode, setMode, onStickerTap, onBack }) {
  const { t, lang, countryName } = useLang();
  const all = useMemo(() => allStickers(counts, names, t, countryName), [counts, names, lang, t, countryName]);

  const repes = useMemo(() => all.filter(s => s.count > 1), [all]);
  const totalRepes = useMemo(() => repes.reduce((acc, s) => acc + (s.count - 1), 0), [repes]);
  const stuckCount = useMemo(() => all.filter(s => s.key !== 'coca' && s.count > 0).length, [all]);
  const dupesPct = stuckCount > 0 ? Math.round((totalRepes / stuckCount) * 100) : 0;

  // Group by sectionTitle, preserving sectionSort order
  const groups = useMemo(() => {
    const m = new Map();
    for (const s of repes) {
      if (!m.has(s.sectionTitle)) {
        m.set(s.sectionTitle, { title: s.sectionTitle, sort: s.sectionSort, items: [] });
      }
      m.get(s.sectionTitle).items.push(s);
    }
    const arr = Array.from(m.values());
    arr.sort((a, b) => a.sort - b.sort);
    arr.forEach(g => g.items.sort((a, b) => a.number - b.number));
    return arr;
  }, [repes]);

  return (
    <div className="px-4 pt-4 pb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-stone-500 active:text-stone-900 mb-3 -ml-1"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">{t('search.back')}</span>
      </button>

      <div className="bg-white rounded-2xl panini-shadow p-4 relative overflow-hidden">
        <div className="absolute -right-3 -top-3 text-7xl opacity-[0.08] select-none pointer-events-none">
          🔥
        </div>
        <div className="relative">
          <div className="font-mono-special text-[10px] tracking-[0.25em] text-amber-700">
            {t('repes.label')}
          </div>
          <div className="font-display text-2xl mt-1">{t('repes.title')}</div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="font-display text-4xl">{totalRepes}</div>
            <div className="text-sm text-stone-500">
              {totalRepes === 1 ? t('repes.figRepeated') : t('repes.figRepeatedPlural')}
            </div>
          </div>
          {repes.length > 0 && (
            <div className="text-xs text-stone-500 mt-1">
              {t('repes.in')} {repes.length} {repes.length === 1 ? t('repes.distinct') : t('repes.distinctPlural')}
              {stuckCount > 0 && (
                <span className="ml-2 font-mono-special bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] tracking-wider">
                  {dupesPct}% {t('repes.ofStuck')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {repes.length === 0 ? (
        <div className="mt-10 text-center text-stone-500 px-6">
          <div className="text-5xl mb-3">📭</div>
          <div className="font-display text-lg">{t('repes.empty.title')}</div>
          <div className="text-sm text-stone-400 mt-2 leading-relaxed">
            {t('repes.empty.sub')}
          </div>
        </div>
      ) : (
        <>
          <ModeToggle mode={mode} setMode={setMode} />

          <div className="mt-4 space-y-5">
            {groups.map(g => {
              const groupTotal = g.items.reduce((acc, s) => acc + (s.count - 1), 0);
              return (
                <div key={g.title}>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <div className="font-display text-sm uppercase tracking-wide text-stone-700">
                      {g.title}
                    </div>
                    <div className="font-mono-special text-[10px] text-stone-400">
                      {groupTotal} {groupTotal === 1 ? t('team.repe') : t('team.repesPlural')}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {g.items.map(s => (
                      <ResultRow key={s.id} s={s} onTap={onStickerTap} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-stone-400 mt-6 font-mono-special tracking-widest">
            {mode === 'add' ? t('repes.tapHint.add') : t('repes.tapHint.sub')}
          </div>
        </>
      )}
    </div>
  );
}


// =========================
// PAGE NAV (prev/next page in album order, used in TeamView and SimpleGridView)
// =========================
function pageLabels(p, t, countryName) {
  if (p.type === 'team') {
    return { label: countryName(p.code), subtitle: `${t('group')} ${p.group}` };
  }
  return {
    label: p.labelKey ? t(p.labelKey) : '',
    subtitle: p.subtitleKey ? t(p.subtitleKey) : '',
  };
}

function PageNav({ currentView, onReplaceView }) {
  const { t, countryName } = useLang();
  const prev = pageNeighbor(currentView, -1);
  const next = pageNeighbor(currentView, +1);
  if (!prev || !next) return null;
  const prevL = pageLabels(prev, t, countryName);
  const nextL = pageLabels(next, t, countryName);
  return (
    <div className="mt-7 grid grid-cols-2 gap-2">
      <button
        onClick={() => onReplaceView(viewFromPage(prev))}
        className="bg-white rounded-2xl panini-shadow px-3 py-2.5 flex items-center gap-2 active:scale-[0.99] transition-transform text-left min-w-0"
      >
        <ChevronLeft size={18} className="text-stone-500 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-mono-special text-[9px] tracking-[0.2em] text-stone-400">{t('pageNav.prev')}</div>
          <div className="font-display text-sm leading-tight truncate">{prevL.label}</div>
          <div className="text-[10px] text-stone-500 truncate">{prevL.subtitle}</div>
        </div>
      </button>
      <button
        onClick={() => onReplaceView(viewFromPage(next))}
        className="bg-white rounded-2xl panini-shadow px-3 py-2.5 flex items-center gap-2 active:scale-[0.99] transition-transform text-left min-w-0"
      >
        <div className="min-w-0 flex-1 text-right">
          <div className="font-mono-special text-[9px] tracking-[0.2em] text-stone-400">{t('pageNav.next')}</div>
          <div className="font-display text-sm leading-tight truncate">{nextL.label}</div>
          <div className="text-[10px] text-stone-500 truncate">{nextL.subtitle}</div>
        </div>
        <ChevronRight size={18} className="text-stone-500 flex-shrink-0" />
      </button>
    </div>
  );
}

// =========================
// SHARED UI
// =========================
function Header({ onBack, title, subtitle, accent }) {
  const { t } = useLang();
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-stone-500 active:text-stone-900 mb-3 -ml-1"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">{t('header.back')}</span>
      </button>
      <div className="bg-white rounded-2xl panini-shadow p-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
        <div className="pl-2">
          <div className="font-display text-2xl leading-tight">{title}</div>
          <div className="text-xs text-stone-500 mt-0.5">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  const { t } = useLang();
  return (
    <div className="flex items-center gap-2 mt-4 bg-white rounded-2xl p-1 panini-shadow">
      <button
        onClick={() => setMode('add')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          mode === 'add'
            ? 'bg-stone-900 text-white'
            : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Plus size={16} strokeWidth={2.5} />
        {t('mode.add')}
      </button>
      <button
        onClick={() => setMode('sub')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          mode === 'sub'
            ? 'bg-stone-900 text-white'
            : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <Minus size={16} strokeWidth={2.5} />
        {t('mode.sub')}
      </button>
    </div>
  );
}

function Legend({ hasNames }) {
  const { t } = useLang();
  return (
    <div className="mt-6 text-[11px] text-stone-500 space-y-1.5 px-1">
      <div className="font-mono-special tracking-widest text-[10px] text-stone-400 mb-2">{t('legend.title')}</div>
      <div>• {t('legend.tap')}</div>
      <div>• {t('legend.swap.before')} <span className="font-medium">{t('mode.sub')}</span> {t('legend.swap.after')}</div>
      <div>• {t('legend.dupes')}</div>
      {hasNames && <div>• {t('legend.editName.before')} <span className="font-medium">"{t('sticker.namePlaceholder')}"</span> {t('legend.editName.after')}</div>}
    </div>
  );
}

function ConfirmReset({ onCancel, onConfirm }) {
  const { t } = useLang();
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-3xl p-6 panini-shadow max-w-md w-full">
        <div className="font-display text-2xl mb-2">{t('reset.title')}</div>
        <div className="text-sm text-stone-600 mb-5">
          {t('reset.body')}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-900 font-medium active:bg-stone-200"
          >
            {t('reset.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-medium active:bg-rose-700"
          >
            {t('reset.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
