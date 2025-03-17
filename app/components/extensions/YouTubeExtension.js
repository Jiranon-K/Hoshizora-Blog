import { Node } from '@tiptap/core';

export function getYoutubeEmbedUrl(url) {
  
  if (!url) {
    return null;
  }

  
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }

  return null;
}

const YouTube = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '640',
      },
      height: {
        default: '360',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-video] iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = getYoutubeEmbedUrl(HTMLAttributes.src);

    return [
      'div',
      { 'data-youtube-video': '' },
      [
        'iframe',
        {
          src: embedUrl,
          width: HTMLAttributes.width,
          height: HTMLAttributes.height,
          frameborder: 0,
          allowfullscreen: 'true',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo: (options) => ({ commands }) => {
        const embedUrl = getYoutubeEmbedUrl(options.src);
        if (!embedUrl) {
          return false;
        }

        return commands.insertContent({
          type: this.name,
          attrs: {
            src: options.src,
            width: options.width || '640',
            height: options.height || '360',
          },
        });
      },
    };
  },
});

export default YouTube;