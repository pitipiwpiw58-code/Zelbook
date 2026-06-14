// DOM Elements
const profilePic = document.getElementById('profile-pic');
const coverPic = document.getElementById('cover-pic');
const profileUpload = document.getElementById('profile-upload');
const coverUpload = document.getElementById('cover-upload');
const editBioBtn = document.getElementById('edit-bio-btn');
const postText = document.getElementById('post-text');
const postImageUpload = document.getElementById('post-image-upload');
const publishPostBtn = document.getElementById('publish-post-btn');
const feedContainer = document.getElementById('feed-container');

let posttext1 = document.getElementById('post-text');
let postImg1 = document.getElementById('post-image-upload');

posttext1.addEventListener('click', function(){
    
    postImg1.style.display = "block";
})

// State Arrays
let posts = JSON.parse(localStorage.getItem('fbPosts')) || [];

// Event Listeners for Photo and Bio Uploads
profileUpload.addEventListener('change', (e) => handleImage(e.target, profilePic, 'profilePic'));
coverUpload.addEventListener('change', (e) => handleImage(e.target, coverPic, 'coverPic'));

editBioBtn.addEventListener('click', () => {
    const newName = prompt("Enter your name:", document.getElementById('profile-name').textContent);
    const newBio = prompt("Enter your bio:", document.getElementById('profile-bio').textContent);
    if(newName) {
        document.getElementById('profile-name').textContent = newName;
        localStorage.setItem('fbName', newName);
    }
    if(newBio) {
        document.getElementById('profile-bio').textContent = newBio;
        localStorage.setItem('fbBio', newBio);
    }
});

// Load Initial Data
window.addEventListener('load', () => {
    if(localStorage.getItem('profilePic')) profilePic.src = localStorage.getItem('profilePic');
    if(localStorage.getItem('coverPic')) coverPic.src = localStorage.getItem('coverPic');
    if(localStorage.getItem('fbName')) document.getElementById('profile-name').textContent = localStorage.getItem('fbName');
    if(localStorage.getItem('fbBio')) document.getElementById('profile-bio').textContent = localStorage.getItem('fbBio');
    renderPosts();
});

// Image to Base64 Handler (To store images in localStorage)
function handleImage(input, imgElement, storageKey) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgElement.src = e.target.result;
            localStorage.setItem(storageKey, e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// Publish Post
publishPostBtn.addEventListener('click', () => {
    const text = postText.value.trim();
    if (text === '') return;

    const file = postImageUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            savePost(text, e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        savePost(text, null);
    }
    postImg1.style.display = "none";
})
});

function savePost(text, imgUrl) {
    const newPost = { id: Date.now(), text, imgUrl, comments: [] };
    posts.unshift(newPost);
    localStorage.setItem('fbPosts', JSON.stringify(posts));
    postText.value = '';
    postImageUpload.value = '';
    renderPosts();
}

// Render Feed
function renderPosts() {
    feedContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        
        let imgHTML = post.imgUrl ? `<div class="post-img"><img src="${post.imgUrl}" alt="Post Image"></div>` : '';
        let commentsHTML = post.comments.map(c => `<div class="comment">${c}</div>`).join('<br>');

        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${profilePic.src}" alt="Author">
                <div><h4>${document.getElementById('profile-name').textContent}</h4><small>Just now</small></div>
            </div>
            <div class="post-text">${post.text}</div>
            ${imgHTML}
            <div class="comments-section">
                <div class="comments-list">${commentsHTML}</div>
                <div class="comment-form">
                    <input type="text" placeholder="Write a comment..." id="input-${post.id}">
                    <button class="fb-btn active" onclick="addComment(${post.id})">Comment</button>
                </div>
            </div>
        `;
        feedContainer.appendChild(postDiv);
    });
}

// Add Comment
window.addComment = function(postId) {
    const inputVal = document.getElementById(`input-${postId}`).value.trim();
    if (inputVal === '') return;

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push(inputVal);
        localStorage.setItem('fbPosts', JSON.stringify(posts));
        renderPosts();
    }
}
