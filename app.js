
const headerActive = ()=>{
  const header = document.getElementById('header')
  let scrollTop = window.scrollY;
   
  if(scrollTop >= 150 ){
    header.classList.add("fixed", "shadow-md");
  }else{
    header.classList.remove("fixed", "shadow-md");

  }

  scrollTop = undefined
}
window.addEventListener('scroll', headerActive)

let fetchData = [];

const fetchNewsCategory = async () => {
  const url = "https://openapi.programming-hero.com/api/news/categories";

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayNewsCategory(data.data);
  } catch (error) {
    console.log(error);
  }
};

const displayNewsCategory = (data) => {
  const NewsContainer = document.getElementById("news__category__container");

  data.news_category.forEach((item) => {
    NewsContainer.innerHTML += `
            <a onclick ="fetchCardData('${item.category_id}','${item.category_name}')" href='#' class="hover:bg-green-100 p-1 hover:text-green-600 md:text-lg">${item.category_name}</a>
        `;
  });
};


const fetchCardData = async (category_id, categoryName) => {
  const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;

  const res = await fetch(url);
  const data = await res.json();
    fetchData = data.data;
  displayAllNews(data.data, categoryName);
};

const displayAllNews = (data, categoryName) => {
  document.getElementById("category__length").textContent = data.length;
  document.getElementById("category__name").textContent = categoryName;

  const cardContainer = document.getElementById("card__container");

  cardContainer.innerHTML = "";
  data.forEach((item) => {
    const {
      image_url,
      title,
      details,
      thumbnail_url,
      author,
      total_view,
      rating,
      _id
    } = item;
    cardContainer.innerHTML += `
           <div class="card card-side bg-base-100 shadow-xl p-3 my-4">
              <figure>
                <img class="max-w-full h-auto" src=${image_url} />
              </figure>
              <div class="card-body">
                <h2 class="card-title">
                 ${title} 
                </h2>
                <p class="text-sm md:text-[14px]">
                  ${details.slice(0, 200)}...see more
                </p>

                <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-4 items-center justify-center">
                  <!-- item 1 -->
                  <div class=" grid grid-cols-[2rem_1fr] gap-2 items-center">
                     <img class="flex-1 block object-cover w-8 h-8 rounded-full ring-1" src=${thumbnail_url} alt="Movie" />

                     <div class="grid grid-cols-2 justify-center items-center">
                        <p class="text-center font-semibold text-[12px] w-full"> ${
                          author.name ? author.name : "No Name Available"
                        } </p>
                     
                     </div>
                  </div>

                  <!-- item 2 -->
                  <div>
                    <p class="font-semibold"><i class="ri-eye-line"></i>           <span>${
                      total_view ? total_view : "No view"
                    }</span>
                    </p>
                  </div>

                  <!-- item 3 -->
                  <div class="flex gap-1">
                   <p> 
                   ${ generateStars(rating.number)}
                   </p>

                   <p>(${rating.number})</p>
                  </div>

                  <!-- item 4 -->
                  <div>
                   <p class="w-5 h-5 bg-transparent rounded-full grid place-content-center cursor-pointer hover:ring-2 hover:ring-green-500 shadow-sm md:ml-auto">
                    <label for="my-modal-3" onclick="singleNewsFetch('${_id}')"><i class="ri-arrow-right-circle-line"></i></label>
                   </p>
                  </div>
                </div>

              </div>
            </div>
        `;

  });
};



const singleNewsFetch = async(singleId)=>{
    const url = ` https://openapi.programming-hero.com/api/news/${singleId}`;
    
    const res = await fetch(url);
    const data = await res.json();

    displaySingleNews(data)
}


const displaySingleNews = (data) =>{
  console.log(data);
    console.log(data);
     const {
       title,
       details,
       thumbnail_url,
       author,
       total_view,
       rating,
       others_info,
    } = data.data[0];
    let modalContainer = document.getElementById("modal");

    const div = document.createElement('div')
    modalContainer.innerHTML = ''
    div.innerHTML = `
     <div class="card card-side">
              
              <div class="card-body">
                <h2 class="card-title">
                 ${title}<span class="w-max-content py-[3px] px-[5px] rounded-sm bg-accent text-sm">${
      others_info.is_trending ? "Trending" : "Not Trending"
    }</span>
                </h2>
                <p class="text-sm md:text-[14px]">
                  ${details}
                </p>

                <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-4 items-center justify-center">
                  <!-- item 1 -->
                  <div class=" grid grid-cols-[2rem_1fr] gap-2 items-center">
                     <img class="flex-1 block object-cover w-8 h-8 rounded-full ring-1" src=${thumbnail_url} alt="Movie" />

                     <div class="grid grid-cols-2 justify-center items-center">
                        <p class="text-center font-semibold text-[12px] w-full"> ${
                          author.name ? author.name : "No Name Available"
                        } </p>
                     
                     </div>
                  </div>

                  <!-- item 2 -->
                  <div>
                    <p class="font-semibold"><i class="ri-eye-line"></i>           <span>${
                      total_view ? total_view : "No view"
                    }</span>
                    </p>
                  </div>

                  <!-- item 3 -->
                  <div>
                   <p> 
                   ${generateStars(rating.number)}
                   </p>

                   <p>(${rating.number})</p>
                   
                  </div>

                  <!-- item 4 -->
                  <div>
                   <p class="w-5 h-5 bg-transparent rounded-full grid place-content-center cursor-pointer hover:ring-2 hover:ring-green-500 shadow-sm md:ml-auto">
                    
                   </p>
                  </div>
                </div>

              </div>
            </div>
    `;

    modalContainer.appendChild(div)
}


const showTrending = () =>{
    let filtered = fetchData.filter(item=> item.others_info.is_trending === true);
    const categoryName = document.getElementById("category__name").innerText;
    displayAllNews(filtered, categoryName);
}


const showToDaysPic = () =>{
  let filtered = fetchData.filter(
    (item) => item.others_info.is_todays_pick === true
  );
  const categoryName = document.getElementById("category__name").innerText;
  displayAllNews(filtered, categoryName);
}


const generateStars = (rating)=>{
 let ratingHtml = '';

 for(let i = 1; i <= Math.floor(rating); i++){
  ratingHtml += '<i class="ri-star-s-fill"></i>';


}
if(rating - Math.floor(rating) > 0){
  ratingHtml += '<i class="ri-star-half-s-fill"></i>';
 return ratingHtml
}

}