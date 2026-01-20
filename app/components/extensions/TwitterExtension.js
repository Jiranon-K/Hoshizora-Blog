import { Node } from "@tiptap/core";

/**
 * Extract Tweet ID from various Twitter/X URL formats
 * Supports: twitter.com, x.com, mobile URLs
 */
export function getTweetId(url) {
  if (!url) return null;

  // Match patterns like:
  // https://twitter.com/username/status/1234567890
  // https://x.com/username/status/1234567890
  // https://mobile.twitter.com/username/status/1234567890
  const regExp =
    /(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i;
  const match = url.match(regExp);

  if (match && match[2]) {
    return {
      username: match[1],
      tweetId: match[2],
    };
  }

  return null;
}

/**
 * Generate Twitter embed URL for static display
 */
export function getTwitterEmbedUrl(url) {
  const tweetData = getTweetId(url);
  if (!tweetData) return null;

  // Using Twitter's publish embed endpoint
  return `https://platform.twitter.com/embed/Tweet.html?id=${tweetData.tweetId}&theme=dark`;
}

const Twitter = Node.create({
  name: "twitter",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      tweetId: {
        default: null,
      },
      username: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-twitter-embed]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const tweetData = getTweetId(HTMLAttributes.src);

    if (!tweetData) {
      return ["div", { class: "twitter-error" }, "Invalid Twitter URL"];
    }

    return [
      "div",
      {
        "data-twitter-embed": "",
        "data-tweet-id": tweetData.tweetId,
        "data-username": tweetData.username,
        class: "twitter-embed-container",
      },
      [
        "iframe",
        {
          src: `https://platform.twitter.com/embed/Tweet.html?id=${tweetData.tweetId}&theme=dark`,
          width: "550",
          height: "400",
          frameborder: "0",
          scrolling: "no",
          style: "border: none; max-width: 100%;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setTwitterEmbed:
        (options) =>
        ({ commands }) => {
          const tweetData = getTweetId(options.src);
          if (!tweetData) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              tweetId: tweetData.tweetId,
              username: tweetData.username,
            },
          });
        },
    };
  },
});

export default Twitter;
