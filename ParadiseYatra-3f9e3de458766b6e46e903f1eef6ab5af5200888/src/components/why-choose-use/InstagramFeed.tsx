// import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Instagram, ExternalLink, Verified } from 'lucide-react';

// export function InstagramFeed() {
//   const posts = [
//     {
//       url: "https://www.instagram.com/p/DMenU3jJaQq/",
//       image: "https://instagram.fdel25-1.fna.fbcdn.net/v/t51.82787-15/522677331_18057454616372951_6374246959180024144_n.webp?_nc_cat=108&ig_cache_key=MzY4MzU1NDQ5MjE2MjYwNzg0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=NqjQ9TfdoFkQ7kNvwHSEsrE&_nc_oc=AdkI7Ak2_h3aOSCQllM2UZv90RLvqG0YCDzRSmBACeEpy9XpXvD9EYIuhKPfNN45VV0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-1.fna&_nc_gid=cQlLCv7o5s8a27LySuZrYw&oh=00_AfogzBDZ2CUfUR4USA_mLH4pVpXgMaUFlvwB_gedfTxReg&oe=69616D7E", // Mountain Night
//       caption: "🌍✈️ Not all who wander are lost... some just booked with Paradise Yatra.",
//     },
//     {
//       url: "https://www.instagram.com/p/DQthyqWDLFg/",
//       image: "https://instagram.fdel25-1.fna.fbcdn.net/v/t39.30808-6/578248826_1255859793232106_2918973461870021639_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzc1OTgwOTg4MDkwMDAyMjYyNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwMjR4MTI4MC5zZHIuQzMifQ%3D%3D&_nc_ohc=4bdPZF_g1H4Q7kNvwG1eH2d&_nc_oc=AdlpHs7MkJ_EkMBBk-UFDkp70RvFA-w36NeIhxTP5TBAwUT2P5xXXHKeViOZuSbdWXc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-1.fna&_nc_gid=Ro5r3ISIOuZV3VijpuuApg&oh=00_AfoChqpg5ax0_y2LgGd_eStaVH8lXfP4EYO1gEdJwnvWGA&oe=69618C0C", // Lake/Nature
     
//       caption: "✨ Feeling stuck in the same daily routine? It’s time to hit pause and explore something new! 🌴✈️",
//     },
//     {
//       url: "https://www.instagram.com/p/DNhyJY7JJx-/",
//       image: "https://instagram.fdel25-1.fna.fbcdn.net/v/t51.82787-15/534637262_18059989928372951_5387980187081451818_n.webp?_nc_cat=101&ig_cache_key=MzcwMjQ2MDkwNzQwNTE0ODM1Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=8-3Jct_wmU0Q7kNvwEWl1UK&_nc_oc=AdkQE5FiVCZ8O0kwlJb_mz5tNo6ab5n6MBwOydy2c3inIJPOKXS3QoqdwQE7zV9KNTY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-1.fna&_nc_gid=bYopOnQ_9zMcpCZ1KbPD7Q&oh=00_AfphL0jqCdzMwVLsjCqbu81IPXHXUPGVwSJhrOC0uxmxJw&oe=69618986", // Adventure/Travel
     
//       caption: "✨ Embark on a divine journey through Uttarakhand’s most sacred temples! 🕉️",
//     },
//     {
//       url: "https://www.instagram.com/p/DMR_QfQpARi/",
//       image: "https://instagram.fdel25-4.fna.fbcdn.net/v/t51.82787-15/521108789_18056976647372951_1580724475895110177_n.webp?_nc_cat=107&ig_cache_key=MzY4MDAwMDU2NTQyOTE4MTA3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=i3Lr7tfeTjsQ7kNvwFDUjy_&_nc_oc=AdnNsAmnTLOYpAlkBvFVYDsoGxWiGEPBD09PKvm1d0zVh0uzcF62YBjyy59KfAyDjS4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-4.fna&_nc_gid=B6ZhG-UXAPevYzPWmujtqg&oh=00_Afp-pEHKGYW-V0gmBx0y5iwCCHF_1KYWRLVWvrpKoxGZyQ&oe=6961921F", // High Peaks
     
//       caption: "🌄 Explore the Soul of Sikkim – Where Every Stop Tells a Story 🏔️✨",
//     }
//   ];

//   return (
//     <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
//         <div>
//           <div className="flex items-center gap-3 mb-3">
//             <div className="relative">
//               <div className="absolute rounded-full"></div>
//               <div className="relative bg-white p-2.5 rounded-2xl">
//                 <Instagram className="w-7 h-7 text-pink-600" />
//               </div>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
//               Live from Instagram
//             </h2>
//           </div>
//           <p className="text-slate-600 text-base md:text-lg flex items-center gap-2">
//             Follow 
//             <a 
//               href="https://www.instagram.com/paradiseyatra" 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:underline inline-flex items-center gap-1"
//             >
//               @ParadiseYatra
//               <Verified className="w-4 h-4 text-blue-500 fill-blue-500" />
//             </a> 
//           </p>
//         </div>

//         <a
//           href="https://www.instagram.com/paradiseyatra"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
//         >
//           <Instagram className="w-5 h-5" />
//           Follow on Instagram
//           <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//         </a>
//       </div>

//       {/* Posts Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         {posts.map((post, idx) => (
//           <div
//             key={idx}
//             className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
//           >
//             {/* Post Header */}
//             <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
//                   <div className="bg-white rounded-full p-[1px] h-full w-full">
//                      <div className="bg-slate-100 h-full w-full rounded-full flex items-center justify-center overflow-hidden">
//                         <img 
//                           src="https://res.cloudinary.com/dwuwpxu0y/image/upload/v1767618411/DP_y3bf1a.png" 
//                           alt="profile" 
//                           className="w-full h-full object-cover"
//                         />
//                      </div>
//                   </div>
//                 </div>
//                 <span className="font-bold text-xs text-slate-900">paradise_yatra</span>
//               </div>
//               <MoreHorizontal className="w-4 h-4 !text-slate-8  00 cursor-pointer" />
//             </div>

//             {/* Post Image with Link */}
//          <a 
//               href={post.url} 
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="block relative overflow-hidden bg-slate-100"
//               style={{ aspectRatio: '4/5' }}
//             >
//               <img
//                 src={post.image}
//                 alt="Instagram post thumbnail"
//                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
//                     <Instagram className="text-white w-6 h-6" />
//                  </div>
//               </div>
//             </a>

//             {/* Post Interactions */}
//             <div className="p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex gap-4">
//                   <Heart className="w-6 h-6 text-slate-800 hover:text-red-500 hover:fill-red-500 transition-all cursor-pointer" />
//                   <MessageCircle className="w-6 h-6 text-slate-800 cursor-pointer" />
//                   <Send className="w-6 h-6 text-slate-800 cursor-pointer" />
//                 </div>
//                 <Bookmark className="w-6 h-6 text-slate-800 cursor-pointer hover:fill-slate-800 transition-all" />
//               </div>
              
//               <div className="text-sm text-slate-800 mb-2 line-clamp-2 leading-relaxed">
//                 <span className="font-bold mr-2">paradise_yatra</span>
//                 {post.caption}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Instagram, ExternalLink, Verified, BadgeCheck } from 'lucide-react';

export function InstagramFeed() {
  const posts = [
    {
      url: "https://www.instagram.com/p/DMenU3jJaQq/",
      image: "https://instagram.fdel25-1.fna.fbcdn.net/v/t51.82787-15/522677331_18057454616372951_6374246959180024144_n.webp?_nc_cat=108&ig_cache_key=MzY4MzU1NDQ5MjE2MjYwNzg0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=NqjQ9TfdoFkQ7kNvwHSEsrE&_nc_oc=AdkI7Ak2_h3aOSCQllM2UZv90RLvqG0YCDzRSmBACeEpy9XpXvD9EYIuhKPfNN45VV0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-1.fna&_nc_gid=cQlLCv7o5s8a27LySuZrYw&oh=00_AfogzBDZ2CUfUR4USA_mLH4pVpXgMaUFlvwB_gedfTxReg&oe=69616D7E",
      caption: "🌍✈️ Not all who wander are lost... some just booked with Paradise Yatra.",
    },
    {
      url: "https://www.instagram.com/p/DQthyqWDLFg/",
      image: "https://instagram.fdel25-1.fna.fbcdn.net/v/t39.30808-6/578248826_1255859793232106_2918973461870021639_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzc1OTgwOTg4MDkwMDAyMjYyNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwMjR4MTI4MC5zZHIuQzMifQ%3D%3D&_nc_ohc=4bdPZF_g1H4Q7kNvwG1eH2d&_nc_oc=AdlpHs7MkJ_EkMBBk-UFDkp70RvFA-w36NeIhxTP5TBAwUT2P5xXXHKeViOZuSbdWXc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-1.fna&_nc_gid=Ro5r3ISIOuZV3VijpuuApg&oh=00_AfoChqpg5ax0_y2LgGd_eStaVH8lXfP4EYO1gEdJwnvWGA&oe=69618C0C",
      caption: "✨ Feeling stuck in the same daily routine? It's time to hit pause and explore something new! 🌴✈️",
    },
    {
      url: "https://www.instagram.com/p/DNhyJY7JJx-/",
      image: "https://instagram.fdel25-1.fna.fbcdn.net/v/t51.82787-15/534637262_18059989928372951_5387980187081451818_n.webp?_nc_cat=101&ig_cache_key=MzcwMjQ2MDkwNzQwNTE0ODM1Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=8-3Jct_wmU0Q7kNvwEWl1UK&_nc_oc=AdkQE5FiVCZ8O0kwlJb_mz5tNo6ab5n6MBwOydy2c3inIJPOKXS3QoqdwQE7zV9KNTY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-1.fna&_nc_gid=bYopOnQ_9zMcpCZ1KbPD7Q&oh=00_AfphL0jqCdzMwVLsjCqbu81IPXHXUPGVwSJhrOC0uxmxJw&oe=69618986",
      caption: "✨ Embark on a divine journey through Uttarakhand's most sacred temples! 🕉️",
    },
    {
      url: "https://www.instagram.com/p/DMR_QfQpARi/",
      image: "https://instagram.fdel25-4.fna.fbcdn.net/v/t51.82787-15/521108789_18056976647372951_1580724475895110177_n.webp?_nc_cat=107&ig_cache_key=MzY4MDAwMDU2NTQyOTE4MTA3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=i3Lr7tfeTjsQ7kNvwFDUjy_&_nc_oc=AdnNsAmnTLOYpAlkBvFVYDsoGxWiGEPBD09PKvm1d0zVh0uzcF62YBjyy59KfAyDjS4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fdel25-4.fna&_nc_gid=B6ZhG-UXAPevYzPWmujtqg&oh=00_Afp-pEHKGYW-V0gmBx0y5iwCCHF_1KYWRLVWvrpKoxGZyQ&oe=6961921F",
      caption: "🌄 Explore the Soul of Sikkim – Where Every Stop Tells a Story 🏔️✨",
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute rounded-full"></div>
              <div className="relative">
                <Instagram className="w-10 h-10 text-pink-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl !font-black !leading-[1.05] tracking-tight text-slate-900">
              Live from Instagram
            </h2>
          </div>
          <p className="!text-slate-600 text-base md:text-lg leading-relaxed flex items-center gap-2">
            Follow 
            <a 
              href="https://www.instagram.com/paradiseyatra" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:underline inline-flex items-center gap-1"
            >
              @ParadiseYatra
            </a> 
          </p>
        </div>

        <a
          href="https://www.instagram.com/paradiseyatra"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
        >
          <Instagram className="w-5 h-5" />
          Follow on Instagram
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {posts.map((post, idx) => (
          <a
            key={idx}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Post Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                  <div className="bg-white rounded-full p-[1px] h-full w-full">
                    <div className="bg-slate-100 h-full w-full rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://res.cloudinary.com/dwuwpxu0y/image/upload/v1767618411/DP_y3bf1a.png" 
                        alt="profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <span className="font-bold text-xs text-slate-900">paradise_yatra</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-800" />
            </div>

            {/* Post Image */}
            <div 
              className="relative overflow-hidden bg-slate-100"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src={post.image}
                alt="Instagram post thumbnail"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/0 group-hover:bg-white/20 backdrop-blur-0 group-hover:backdrop-blur-md p-3 rounded-full transition-all duration-300 transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                  <Instagram className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Post Interactions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 text-slate-800 hover:text-red-500 hover:fill-red-500 transition-all" />
                  <MessageCircle className="w-6 h-6 text-slate-800" />
                  <Send className="w-6 h-6 text-slate-800" />
                </div>
                <Bookmark className="w-6 h-6 text-slate-800 hover:fill-slate-800 transition-all" />
              </div>
              
              <div className="text-sm text-slate-800 mb-2 line-clamp-2 leading-relaxed">
                <span className="font-bold mr-2">paradise_yatra</span>
                {post.caption}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}