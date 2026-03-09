/**
 * Sangeet - Indian Music Player
 * Song Catalog Database
 *
 * NOTE: This catalog contains metadata for demonstration purposes.
 * Actual music files are not included due to copyright restrictions.
 * To use with real music, replace the `src` fields with paths to
 * properly licensed audio/video files.
 *
 * Song format:
 * {
 *   id: number,
 *   title: string,
 *   artist: string,
 *   movie: string,
 *   year: number,
 *   decade: string,        // "1970s", "1980s", etc.
 *   genre: string,
 *   language: string,
 *   type: "mp3" | "video", // playback format
 *   duration: string,      // "m:ss" format
 *   durationSec: number,   // duration in seconds
 *   color: string,         // artwork background color
 *   src: string            // path/URL to media file
 * }
 */

// eslint-disable-next-line no-unused-vars
var songCatalog = [
  // ===== 1970s =====
  { id: 1, title: "Dum Maro Dum", artist: "Asha Bhosle", movie: "Hare Rama Hare Krishna", year: 1971, decade: "1970s", genre: "Retro", language: "Hindi", type: "mp3", duration: "5:12", durationSec: 312, color: "#e65100", src: "" },
  { id: 2, title: "Chingari Koi Bhadke", artist: "Kishore Kumar", movie: "Amar Prem", year: 1972, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:45", durationSec: 285, color: "#bf360c", src: "" },
  { id: 3, title: "Tere Bina Zindagi Se", artist: "Lata Mangeshkar, Kishore Kumar", movie: "Aandhi", year: 1975, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:30", durationSec: 330, color: "#4a148c", src: "" },
  { id: 4, title: "Roop Tera Mastana", artist: "Kishore Kumar", movie: "Aradhana", year: 1970, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:20", durationSec: 260, color: "#1a237e", src: "" },
  { id: 5, title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", movie: "Aradhana", year: 1970, decade: "1970s", genre: "Fun", language: "Hindi", type: "mp3", duration: "4:35", durationSec: 275, color: "#006064", src: "" },
  { id: 6, title: "Yeh Jo Mohabbat Hai", artist: "Kishore Kumar", movie: "Kati Patang", year: 1970, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:55", durationSec: 235, color: "#880e4f", src: "" },
  { id: 7, title: "Kuch Toh Log Kahenge", artist: "Kishore Kumar", movie: "Amar Prem", year: 1972, decade: "1970s", genre: "Philosophical", language: "Hindi", type: "mp3", duration: "4:10", durationSec: 250, color: "#311b92", src: "" },
  { id: 8, title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar", movie: "Blackmail", year: 1973, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:48", durationSec: 288, color: "#0d47a1", src: "" },
  { id: 9, title: "Yeh Sham Mastani", artist: "Kishore Kumar", movie: "Kati Patang", year: 1970, decade: "1970s", genre: "Romantic", language: "Hindi", type: "video", duration: "4:05", durationSec: 245, color: "#b71c1c", src: "" },
  { id: 10, title: "O Mere Dil Ke Chain", artist: "Kishore Kumar", movie: "Mere Jeevan Saathi", year: 1972, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:30", durationSec: 270, color: "#1b5e20", src: "" },
  { id: 11, title: "Chalte Chalte Mere Yeh Geet", artist: "Kishore Kumar", movie: "Chalte Chalte", year: 1976, decade: "1970s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:08", durationSec: 308, color: "#e91e63", src: "" },
  { id: 12, title: "Mehbooba Mehbooba", artist: "R.D. Burman", movie: "Sholay", year: 1975, decade: "1970s", genre: "Item", language: "Hindi", type: "video", duration: "5:45", durationSec: 345, color: "#ff6f00", src: "" },

  // ===== 1980s =====
  { id: 13, title: "Ek Do Teen", artist: "Alka Yagnik", movie: "Tezaab", year: 1988, decade: "1980s", genre: "Dance", language: "Hindi", type: "video", duration: "5:20", durationSec: 320, color: "#c62828", src: "" },
  { id: 14, title: "Hawa Hawai", artist: "Kavita Krishnamurthy", movie: "Mr. India", year: 1987, decade: "1980s", genre: "Fun", language: "Hindi", type: "mp3", duration: "5:48", durationSec: 348, color: "#ad1457", src: "" },
  { id: 15, title: "Jumma Chumma De De", artist: "Sudesh Bhosle, Kavita Krishnamurthy", movie: "Hum", year: 1988, decade: "1980s", genre: "Dance", language: "Hindi", type: "mp3", duration: "5:15", durationSec: 315, color: "#6a1b9a", src: "" },
  { id: 16, title: "Meri Zindagi Mein Ajnabi", artist: "Lata Mangeshkar, Kishore Kumar", movie: "Ajnabi", year: 1980, decade: "1980s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:50", durationSec: 290, color: "#283593", src: "" },
  { id: 17, title: "Pyar Kiya Toh Darna Kya", artist: "Lata Mangeshkar", movie: "Mughal-e-Azam (Revival)", year: 1981, decade: "1980s", genre: "Classic", language: "Hindi", type: "mp3", duration: "4:25", durationSec: 265, color: "#0277bd", src: "" },
  { id: 18, title: "Sare Shaher Mein", artist: "Asha Bhosle, R.D. Burman", movie: "Namak Halaal", year: 1982, decade: "1980s", genre: "Fun", language: "Hindi", type: "mp3", duration: "4:40", durationSec: 280, color: "#00838f", src: "" },
  { id: 19, title: "Tamma Tamma Loge", artist: "Anuradha Paudwal, Bappi Lahiri", movie: "Thanedaar", year: 1989, decade: "1980s", genre: "Dance", language: "Hindi", type: "video", duration: "5:30", durationSec: 330, color: "#558b2f", src: "" },
  { id: 20, title: "I Am a Disco Dancer", artist: "Vijay Benedict", movie: "Disco Dancer", year: 1982, decade: "1980s", genre: "Disco", language: "Hindi", type: "mp3", duration: "6:10", durationSec: 370, color: "#ff6f00", src: "" },
  { id: 21, title: "Aap Jaisa Koi", artist: "Nazia Hassan", movie: "Qurbani", year: 1980, decade: "1980s", genre: "Pop", language: "Hindi", type: "mp3", duration: "5:22", durationSec: 322, color: "#d84315", src: "" },
  { id: 22, title: "Om Shanti Om", artist: "Kishore Kumar", movie: "Karz", year: 1980, decade: "1980s", genre: "Disco", language: "Hindi", type: "video", duration: "5:55", durationSec: 355, color: "#4e342e", src: "" },
  { id: 23, title: "Tumse Milke Dilka Jo Haal", artist: "S.P. Balasubrahmanyam", movie: "Main Hoon Na", year: 1983, decade: "1980s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:18", durationSec: 258, color: "#37474f", src: "" },
  { id: 24, title: "Dil Deewana", artist: "Lata Mangeshkar", movie: "Maine Pyar Kiya", year: 1989, decade: "1980s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:45", durationSec: 285, color: "#e91e63", src: "" },

  // ===== 1990s =====
  { id: 25, title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh, Sapna Awasthi", movie: "Dil Se", year: 1998, decade: "1990s", genre: "Dance", language: "Hindi", type: "video", duration: "6:20", durationSec: 380, color: "#e65100", src: "" },
  { id: 26, title: "Tujhe Dekha Toh Yeh Jaana Sanam", artist: "Kumar Sanu, Lata Mangeshkar", movie: "DDLJ", year: 1995, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:45", durationSec: 345, color: "#1a237e", src: "" },
  { id: 27, title: "Dil To Pagal Hai", artist: "Lata Mangeshkar, Udit Narayan", movie: "Dil To Pagal Hai", year: 1997, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:10", durationSec: 310, color: "#880e4f", src: "" },
  { id: 28, title: "Pehla Nasha", artist: "Udit Narayan, Sadhana Sargam", movie: "Jo Jeeta Wohi Sikandar", year: 1992, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:00", durationSec: 300, color: "#4a148c", src: "" },
  { id: 29, title: "Tu Cheez Badi Hai Mast Mast", artist: "Kavita Krishnamurthy, Udit Narayan", movie: "Mohra", year: 1994, decade: "1990s", genre: "Dance", language: "Hindi", type: "video", duration: "5:15", durationSec: 315, color: "#b71c1c", src: "" },
  { id: 30, title: "Mere Khwabon Mein Jo Aaye", artist: "Lata Mangeshkar", movie: "DDLJ", year: 1995, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:50", durationSec: 290, color: "#0d47a1", src: "" },
  { id: 31, title: "Kuch Kuch Hota Hai", artist: "Udit Narayan, Alka Yagnik", movie: "Kuch Kuch Hota Hai", year: 1998, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:22", durationSec: 322, color: "#00695c", src: "" },
  { id: 32, title: "Didi Tera Devar Deewana", artist: "Lata Mangeshkar, S.P. Balasubrahmanyam", movie: "Hum Aapke Hain Koun", year: 1994, decade: "1990s", genre: "Fun", language: "Hindi", type: "video", duration: "5:40", durationSec: 340, color: "#e91e63", src: "" },
  { id: 33, title: "Chura Ke Dil Mera", artist: "Kumar Sanu", movie: "Main Khiladi Tu Anari", year: 1994, decade: "1990s", genre: "Dance", language: "Hindi", type: "mp3", duration: "4:55", durationSec: 295, color: "#ff6f00", src: "" },
  { id: 34, title: "Tip Tip Barsa Paani", artist: "Alka Yagnik, Udit Narayan", movie: "Mohra", year: 1994, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "6:05", durationSec: 365, color: "#1b5e20", src: "" },
  { id: 35, title: "Taal Se Taal Mila", artist: "Alka Yagnik, Udit Narayan", movie: "Taal", year: 1999, decade: "1990s", genre: "Dance", language: "Hindi", type: "mp3", duration: "5:30", durationSec: 330, color: "#311b92", src: "" },
  { id: 36, title: "Ae Mere Humsafar", artist: "Udit Narayan, Alka Yagnik", movie: "Qayamat Se Qayamat Tak", year: 1990, decade: "1990s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:12", durationSec: 312, color: "#006064", src: "" },

  // ===== 2000s =====
  { id: 37, title: "Kal Ho Naa Ho", artist: "Sonu Nigam", movie: "Kal Ho Naa Ho", year: 2003, decade: "2000s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:20", durationSec: 320, color: "#1a237e", src: "" },
  { id: 38, title: "Kajra Re", artist: "Alisha Chinai, Shankar Mahadevan, Javed Ali", movie: "Bunty Aur Babli", year: 2005, decade: "2000s", genre: "Dance", language: "Hindi", type: "video", duration: "5:45", durationSec: 345, color: "#b71c1c", src: "" },
  { id: 39, title: "Tere Bina", artist: "A.R. Rahman", movie: "Guru", year: 2007, decade: "2000s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:10", durationSec: 310, color: "#4a148c", src: "" },
  { id: 40, title: "Rang De Basanti", artist: "Daler Mehndi", movie: "Rang De Basanti", year: 2006, decade: "2000s", genre: "Patriotic", language: "Hindi", type: "mp3", duration: "5:32", durationSec: 332, color: "#e65100", src: "" },
  { id: 41, title: "Jai Ho", artist: "Sukhwinder Singh, Mahalaxmi Iyer", movie: "Slumdog Millionaire", year: 2008, decade: "2000s", genre: "Celebration", language: "Hindi", type: "video", duration: "5:18", durationSec: 318, color: "#ff6f00", src: "" },
  { id: 42, title: "Masakali", artist: "Mohit Chauhan", movie: "Delhi-6", year: 2009, decade: "2000s", genre: "Melodious", language: "Hindi", type: "mp3", duration: "4:58", durationSec: 298, color: "#0d47a1", src: "" },
  { id: 43, title: "Dil Chahta Hai", artist: "Shankar Mahadevan", movie: "Dil Chahta Hai", year: 2001, decade: "2000s", genre: "Friendship", language: "Hindi", type: "mp3", duration: "5:05", durationSec: 305, color: "#00695c", src: "" },
  { id: 44, title: "Munni Badnaam Hui", artist: "Mamta Sharma, Aishwarya", movie: "Dabangg", year: 2009, decade: "2000s", genre: "Item", language: "Hindi", type: "video", duration: "4:30", durationSec: 270, color: "#880e4f", src: "" },
  { id: 45, title: "Tujh Mein Rab Dikhta Hai", artist: "Roop Kumar Rathod", movie: "Rab Ne Bana Di Jodi", year: 2008, decade: "2000s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:42", durationSec: 342, color: "#311b92", src: "" },
  { id: 46, title: "Tumhi Ho Bandhu", artist: "Neeraj Shridhar, Kavita Seth", movie: "Cocktail", year: 2009, decade: "2000s", genre: "Friendship", language: "Hindi", type: "mp3", duration: "4:12", durationSec: 252, color: "#1b5e20", src: "" },
  { id: 47, title: "Beedi Jalaile", artist: "Sukhwinder Singh, Sunidhi Chauhan", movie: "Omkara", year: 2006, decade: "2000s", genre: "Folk", language: "Hindi", type: "mp3", duration: "4:48", durationSec: 288, color: "#bf360c", src: "" },
  { id: 48, title: "Bole Chudiyan", artist: "Sonu Nigam, Alka Yagnik, Kavita Krishnamurthy, Udit Narayan", movie: "K3G", year: 2001, decade: "2000s", genre: "Wedding", language: "Hindi", type: "video", duration: "5:55", durationSec: 355, color: "#e91e63", src: "" },

  // ===== 2010s =====
  { id: 49, title: "Tum Hi Ho", artist: "Arijit Singh", movie: "Aashiqui 2", year: 2013, decade: "2010s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:22", durationSec: 262, color: "#b71c1c", src: "" },
  { id: 50, title: "Gerua", artist: "Arijit Singh, Antara Mitra", movie: "Dilwale", year: 2015, decade: "2010s", genre: "Romantic", language: "Hindi", type: "video", duration: "5:38", durationSec: 338, color: "#e65100", src: "" },
  { id: 51, title: "Badtameez Dil", artist: "Benny Dayal, Shefali Alvares", movie: "Yeh Jawaani Hai Deewani", year: 2013, decade: "2010s", genre: "Dance", language: "Hindi", type: "mp3", duration: "4:10", durationSec: 250, color: "#880e4f", src: "" },
  { id: 52, title: "Lungi Dance", artist: "Yo Yo Honey Singh", movie: "Chennai Express", year: 2013, decade: "2010s", genre: "Dance", language: "Hindi", type: "video", duration: "4:05", durationSec: 245, color: "#ff6f00", src: "" },
  { id: 53, title: "Galliyan", artist: "Ankit Tiwari", movie: "Ek Villain", year: 2014, decade: "2010s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:45", durationSec: 285, color: "#4a148c", src: "" },
  { id: 54, title: "Channa Mereya", artist: "Arijit Singh", movie: "Ae Dil Hai Mushkil", year: 2016, decade: "2010s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:50", durationSec: 290, color: "#1a237e", src: "" },
  { id: 55, title: "Kar Gayi Chull", artist: "Badshah, Neha Kakkar, Fazilpuria", movie: "Kapoor & Sons", year: 2016, decade: "2010s", genre: "Party", language: "Hindi", type: "mp3", duration: "3:25", durationSec: 205, color: "#00695c", src: "" },
  { id: 56, title: "Aashiqui Mein Teri", artist: "Himesh Reshammiya, Ranu Mondal", movie: "Happy Hardy And Heer", year: 2019, decade: "2010s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:55", durationSec: 235, color: "#bf360c", src: "" },
  { id: 57, title: "Cheap Thrills (Vidya Vox Mashup)", artist: "Vidya Vox", movie: "Independent", year: 2016, decade: "2010s", genre: "Fusion", language: "Hindi", type: "video", duration: "3:30", durationSec: 210, color: "#0d47a1", src: "" },
  { id: 58, title: "Raabta", artist: "Arijit Singh", movie: "Agent Vinod", year: 2012, decade: "2010s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:15", durationSec: 255, color: "#1b5e20", src: "" },
  { id: 59, title: "Ghungroo", artist: "Arijit Singh, Shilpa Rao", movie: "War", year: 2019, decade: "2010s", genre: "Dance", language: "Hindi", type: "video", duration: "4:40", durationSec: 280, color: "#e91e63", src: "" },
  { id: 60, title: "Tera Ban Jaunga", artist: "Akhil Sachdeva, Tulsi Kumar", movie: "Kabir Singh", year: 2019, decade: "2010s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:58", durationSec: 238, color: "#311b92", src: "" },

  // ===== 2020s =====
  { id: 61, title: "Kesariya", artist: "Arijit Singh", movie: "Brahmastra", year: 2022, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:28", durationSec: 268, color: "#e65100", src: "" },
  { id: 62, title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", movie: "RRR", year: 2022, decade: "2020s", genre: "Dance", language: "Telugu", type: "video", duration: "4:15", durationSec: 255, color: "#b71c1c", src: "" },
  { id: 63, title: "Raataan Lambiyan", artist: "Jubin Nautiyal, Asees Kaur", movie: "Shershaah", year: 2021, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:48", durationSec: 228, color: "#4a148c", src: "" },
  { id: 64, title: "Maan Meri Jaan", artist: "King", movie: "Independent", year: 2022, decade: "2020s", genre: "Pop", language: "Hindi", type: "mp3", duration: "3:12", durationSec: 192, color: "#1a237e", src: "" },
  { id: 65, title: "Apna Bana Le", artist: "Arijit Singh", movie: "Bhediya", year: 2022, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:35", durationSec: 275, color: "#880e4f", src: "" },
  { id: 66, title: "Tere Hawaale", artist: "Arijit Singh, Shashaa Tirupati", movie: "Laal Singh Chaddha", year: 2022, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "5:05", durationSec: 305, color: "#00695c", src: "" },
  { id: 67, title: "Jhoome Jo Pathaan", artist: "Arijit Singh, Sukriti Kakar", movie: "Pathaan", year: 2023, decade: "2020s", genre: "Dance", language: "Hindi", type: "video", duration: "3:50", durationSec: 230, color: "#ff6f00", src: "" },
  { id: 68, title: "Besharam Rang", artist: "Caralisa Monteiro, Shilpa Rao", movie: "Pathaan", year: 2023, decade: "2020s", genre: "Dance", language: "Hindi", type: "video", duration: "3:45", durationSec: 225, color: "#c62828", src: "" },
  { id: 69, title: "What Jhumka", artist: "Arijit Singh, Jonita Gandhi", movie: "Rocky Aur Rani Kii Prem Kahaani", year: 2023, decade: "2020s", genre: "Dance", language: "Hindi", type: "mp3", duration: "3:38", durationSec: 218, color: "#6a1b9a", src: "" },
  { id: 70, title: "O Bedardeya", artist: "Arijit Singh", movie: "Tu Jhoothi Main Makkaar", year: 2023, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:22", durationSec: 262, color: "#0d47a1", src: "" },
  { id: 71, title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", movie: "Jawan", year: 2023, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:55", durationSec: 235, color: "#1b5e20", src: "" },
  { id: 72, title: "Tera Yaar Hoon Main", artist: "Arijit Singh", movie: "Sonu Ke Titu Ki Sweety", year: 2020, decade: "2020s", genre: "Friendship", language: "Hindi", type: "mp3", duration: "4:08", durationSec: 248, color: "#bf360c", src: "" },
  { id: 73, title: "Shaamat", artist: "Ankit Tiwari", movie: "Ek Villain Returns", year: 2022, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:15", durationSec: 255, color: "#37474f", src: "" },
  { id: 74, title: "Tere Pyaar Mein", artist: "Arijit Singh", movie: "Tu Jhoothi Main Makkaar", year: 2023, decade: "2020s", genre: "Romantic", language: "Hindi", type: "video", duration: "3:42", durationSec: 222, color: "#e91e63", src: "" },
  { id: 75, title: "Heeriye", artist: "Jasleen Royal, Arijit Singh", movie: "Independent", year: 2023, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:30", durationSec: 210, color: "#311b92", src: "" },
  { id: 76, title: "Satranga", artist: "Arijit Singh", movie: "Animal", year: 2023, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:48", durationSec: 288, color: "#006064", src: "" },
  { id: 77, title: "Arjan Vailly", artist: "Bhupinder Babbal", movie: "Animal", year: 2023, decade: "2020s", genre: "Intense", language: "Punjabi", type: "mp3", duration: "3:18", durationSec: 198, color: "#4e342e", src: "" },
  { id: 78, title: "Akhiyaan Gulaab", artist: "Mitraz", movie: "Teri Baaton Mein Aisa Uljha Jiya", year: 2024, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "3:45", durationSec: 225, color: "#ad1457", src: "" },
  { id: 79, title: "Tauba Tauba", artist: "Karan Aujla", movie: "Bad Newz", year: 2024, decade: "2020s", genre: "Dance", language: "Punjabi", type: "video", duration: "3:22", durationSec: 202, color: "#ff6f00", src: "" },
  { id: 80, title: "Sajni", artist: "Arijit Singh", movie: "Laapataa Ladies", year: 2024, decade: "2020s", genre: "Romantic", language: "Hindi", type: "mp3", duration: "4:10", durationSec: 250, color: "#1a237e", src: "" }
];
