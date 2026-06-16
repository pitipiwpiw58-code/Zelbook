document.addEventListener('DOMContentLoaded', () => {

    // --- State Initialization ---
    let profilePicUrl = "hazel.jpg";
    
    
    
    const initialPosts = [
        {
            id: 1,
            author: "Hazel Jean",
            time: "Just now",
            text: "Excited to launch my brand new dynamic profile built entirely with HTML, CSS, and modern JavaScript! Let me know what you think in the comments below! 👇",
            likes: 42,
            shares: 5,
            hasLiked: false,
            comments: [
                { commenter: "Kulot",  text: "Wow, this looks exactly like the real thing! Clean work." },
                { commenter: "Suwang", text: "Awesome layout!" }
            ]
        }
    ];

    // --- DOM Elements ---
    const editProfile = document.getElementById('edit-profile');
    const coverUpload = document.getElementById('cover-upload');
    const coverImg = document.getElementById('cover-img');
    const profileUpload = document.getElementById('profile-upload');
    const profileImg = document.getElementById('profile-img');
    
    const bioText = document.getElementById('bio-text');
    const bioInput = document.getElementById('bio-input');
    const editBioBtn = document.getElementById('edit-bio-btn');
    const bioActions = document.getElementById('bio-actions');
    const bioCharCount = document.getElementById('bio-char-count');
    const cancelBioBtn = document.getElementById('cancel-bio-btn');
    const saveBioBtn = document.getElementById('save-bio-btn');

    const statusInput = document.getElementById('status-input');
    const submitPostBtn = document.getElementById('submit-post-btn');
    const postsContainer = document.getElementById('posts-container');

    // --- Feature 1: Image Upload Management ---
    function handleImageUpload(inputElement, targetImgElement) {
        inputElement.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    targetImgElement.src = event.target.result;
                    // If profiling image changes, sync across state variable
                    if(targetImgElement === profileImg) {
                        profilePicUrl = event.target.result;
                        renderPosts(); 
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    handleImageUpload(coverUpload, coverImg);
    handleImageUpload(profileUpload, profileImg);

    // --- Feature 2: Bio Customization Engine ---
    const MAX_BIO_CHARS = 101;

    editBioBtn.addEventListener('click', () => {
        bioInput.value = bioText.textContent;
        toggleBioEditMode(true);
        updateBioCharacterCounter();
    });

    cancelBioBtn.addEventListener('click', () => {
        toggleBioEditMode(false);
    });

    saveBioBtn.addEventListener('click', () => {
        bioText.textContent = bioInput.value.trim() || "No bio added yet.";
        toggleBioEditMode(false);
    });

    bioInput.addEventListener('input', updateBioCharacterCounter);

    function toggleBioEditMode(isEditing) {
        if (isEditing) {
            bioText.classList.add('hidden');
            editBioBtn.classList.add('hidden');
            bioInput.classList.remove('hidden');
            bioActions.classList.remove('hidden');
            bioInput.focus();
        } else {
            bioText.classList.remove('hidden');
            editBioBtn.classList.remove('hidden');
            bioInput.classList.add('hidden');
            bioActions.classList.add('hidden');
        }
    }

    function updateBioCharacterCounter() {
        const remaining = MAX_BIO_CHARS - bioInput.value.length;
        bioCharCount.textContent = `${remaining} characters remaining`;
    }

    // --- Feature 3: Post Interactions & Creation ---
    statusInput.addEventListener('input', () => {
        if (statusInput.value.trim().length > 0) {
            submitPostBtn.classList.remove('hidden');
        } else {
            submitPostBtn.classList.add('hidden');
        }
    });

    submitPostBtn.addEventListener('click', () => {
        const postText = statusInput.value.trim();
        if (!postText) return;

        const newPost = {
            id: Date.now(),
            author: "",
            time: "Just now",
            text: postText,
            likes: 0,
            shares: 0,
            hasLiked: false,
            comments: []
        };

        initialPosts.unshift(newPost);
        statusInput.value = '';
        submitPostBtn.classList.add('hidden');
        renderPosts();
    });

    function toggleLike(postId) {
        const post = initialPosts.find(p => p.id === postId);
        if (post) {
            post.hasLiked = !post.hasLiked;
            post.likes += post.hasLiked ? 1 : -1;
            renderPosts();
        }
    }

    function handleShare(postId) {
        const post = initialPosts.find(p => p.id === postId);
        if (post) {
            post.shares += 1;
                        
                 renderPosts();
        }
    alert("Shared to your newsfeed successfully!");
}
    function addComment(postId, commentText) {
        if (!commentText.trim()) return;
        const post = initialPosts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                commenter: "Hazel Jean",
                text: commentText.trim()
            });
            renderPosts();
        }
    }

    // --- Feature 4: Dynamic DOM Feed Rendering ---
    function renderPosts() {
        postsContainer.innerHTML = '';

        initialPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'post';

            // Generate structural components safely using string interpolation
            postElement.innerHTML = `
                <div class="post-author-bar">
                    <img src="${profilePicUrl}" alt="Avatar" class="small-avatar">
                    <div>
                        <div class="author-name">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                
                <p class="post-text">${escapeHTML(post.text)}</p>
                
                <div class="post-stats-row">
                    <span class="likes-counter">
                        <i class="fas fa-thumbs-up"></i> ${post.likes}
                    </span>
                    <span class="comments-shares-counter">
                        ${post.comments.length} comments • ${post.shares} shares
                    </span>
                </div>
                
                <div class="post-engagements">
                    <button class="engage-btn like-trigger ${post.hasLiked ? 'active' : ''}">
                        <i class="${post.hasLiked ? 'fas' : 'far'} fa-thumbs-up"></i> Like
                    </button>
                    <button class="engage-btn comment-trigger">
                        <i class="far fa-comment"></i> Comment
                    </button>
                    <button class="engage-btn share-trigger">
                        <i class="far fa-share-square"></i> Share
                    </button>
                </div>
                
                <div class="comments-container">
                    <divK class="comment-input-row">
                        <img src="${profilePicUrl}" alt="Avatar" class="small-avatar">
                        <div class="comment-input-wrapper">
                            <input type="text" class="comment-field" placeholder="Write a comment..." data-id="${post.id}">
                        </div>
                    </div>
                    <div class="comments-list">
                        ${post.comments.map(c => `
                            <div class="comment-node" style="margin-top: 8px;">
                        <img src="${c.commenter === 'Kulot' ? 'kulot.jpg' : (c.commenter === 'Suwang' ? 'suwang.jpg' : profilePicUrl)}" alt="Avatar" class="small-avatar">


                                <div class="comment-bubble">
                                    <div class="commenter-name">${c.commenter}</div>
                                    <div class="comment-body">${escapeHTML(c.text)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Inline Action Bindings
            postElement.querySelector('.like-trigger').addEventListener('click', () => toggleLike(post.id));
            postElement.querySelector('.share-trigger').addEventListener('click', () => handleShare(post.id));
            
            const commentField = postElement.querySelector('.comment-field');
            postElement.querySelector('.comment-trigger').addEventListener('click', () => commentField.focus());
            
            commentField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    addComment(post.id, commentField.value);
                }
            });

            postsContainer.appendChild(postElement);
        });
    }

    // Helper sanitization logic protecting from script injection issues
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Engine Kickoff
    renderPosts();
});
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
