// https://api.reddit.com/r/input.value

let input = document.querySelector('.input');
let searchBtn = document.querySelector('.search_btn');
let cardWrapper = document.querySelector('.card_wrapper');
let subredditHeading = document.querySelector('.subreddit_header_section');

let link = 'https://api.reddit.com/';

async function handleInput(event) {

    event.preventDefault();
    let dataArray = [];
    let userInput = input.value.trim();

    userInput = userInput.startsWith('r/') ? userInput : 'r/' + userInput;
    
    
    if(userInput) {

        cardWrapper.innerHTML = '';

        let fetchData = await fetch(link + userInput);
        let response = await fetchData.json();

        let subredditName = response.data.children[0].data.subreddit_name_prefixed;
        document.querySelector('.topic_name').innerHTML = subredditName;
        input.value = subredditName;

        console.log(response);


        dataArray.push(...response.data.children);
        console.log(dataArray);

        dataArray.forEach(post => view(post.data));

    }
}


async function trending() {
   
    cardWrapper.innerHTML = '';

    let dataArray = [];
    let fetchData = await fetch('https://api.reddit.com/top/');
    let response = await fetchData.json();


    subredditHeading.classList.remove('none');
    document.querySelector('.topic_name').innerHTML = 'r/trending';
    input.value = 'r/trending';

    console.log(response);
    dataArray.push(...response.data.children);
    dataArray.forEach(post => view(post.data));

    
   
}

function view(data) {
    
        
    let li = document.createElement('li');
    li.classList.add('card');
    li.classList.add('card_flex');
    let img = 

    li.innerHTML = `<!-- Card Start -->
                        <div class="side_number">
                            <p class="up_arrow">
                                <i class="fas fa-long-arrow-alt-up"></i>
                            </p>
                            <p class="number">
                                ${data.ups >= 1000 ? (data.ups / 1000).toFixed(1).toString() + 'k' : data.ups}
                            </p>
                            <p class="down_arrow">
                                <i class="fas fa-long-arrow-alt-down"></i>
                            </p>
                        </div>

                        <!-- Post-Content -->

                        <div class="post">
                            <p class="desc">
                                Posted byu/${data.author} ${convertDate(data.created_utc)};
                            </p>

                            <p class="heading">
                                ${data.title}
                            </p>

                            <p class="content">
                               
                                ${data.selftext.substr(0,800) ? data.selftext.substr(0,600).trim() + ' ...' : ''}
                                ${Object.keys(data.media_embed).length 
                                    ? getLink(data.media_embed)
                                    :data.preview
                                    ? `<img src = "${data.preview.images[0].source.url}" width = "${data.preview.images[0].source.width}" height = "${data.preview.images[0].source.height}">` : ''}
                                
                            </p>

                            <!-- Comment Info -->

                            <ul class="comment_section">
                                <li>
                                    <i class="fas fa-comment-alt"></i>
                                    <span>${data.num_comments}</span> Comments
                                </li>

                                <li class="share">
                                    <i class="fas fa-share"></i>
                                    <span>Share</span>
                                </li>

                                <li class="save">
                                    <i class="fas fa-file-medical"></i>
                                    <span>Save</span>
                                </li>

                                <li class="dots">
                                    <i class="fas fa-ellipsis-h"></i>
                                </li>
                            </ul>
                        </div>
                    <!-- Card End -->`

                  
        let a = document.createElement('a');
        a.setAttribute('href',`${data.url}`);
        a.append(li);

        cardWrapper.append(a);

        
}


function convertDate(date) {
    return new Date(date * 1000);
}

function getLink(obj) {
    let index = obj.content.indexOf('iframe');
    let endIndex = obj.content.indexOf('&gt');
    let str = '';
    str = `<${obj.content.slice(index,endIndex)}></iframe>`;
    console.log(str);
    return str;
}



searchBtn.addEventListener('click', handleInput);