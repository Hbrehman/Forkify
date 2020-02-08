export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLikes(id, title, author, img) {
        const like = {
            id,
            title, 
            author, 
            img
        };
        this.likes.push(like);
        return like;
    }

    isLiked(id) {
        return this.likes.findIndex(c => c.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}