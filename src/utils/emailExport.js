// Generates a production-ready HTML email from block data

function esc(t) {
  if (!t) return '';
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ROCHE_LOGO_SVG = `<svg viewBox="0 0 800 415.8" xmlns="http://www.w3.org/2000/svg" width="80" height="42" style="display:block;">
  <path fill="#0B41CD" d="M653.7,183c-3.6-7.4-8.7-13-15.2-17s-14-6-22.4-6s-15.9,2-22.4,6s-11.6,9.7-15.2,17c-3.6,7.4-5.4,16-5.4,25.8v22.1c0,9.8,1.8,18.4,5.4,25.8c3.6,7.4,8.7,13,15.2,17s14,5.9,22.4,5.9s15.9-2,22.4-5.9c6.5-4,10.5-8.5,14.1-15.9c1.7-3.5,3.2-7.9,4-12.4l-20.6-4.7c-0.9,4.4-2.4,8.6-4.7,11.5c-3.7,4.8-9.1,6.9-15.2,6.9c-6.1,0-11.5-2.2-15.2-6.9c-3.7-4.8-5.5-11.6-5.5-20v-8.3h63.8v-15.2C659.1,198.9,657.3,190.4,653.7,183z M616.1,180.5c6.1,0,11.5,2.1,15.2,6.8c3.3,4.2,5.1,10.6,5.5,17.9h-41.4c0.3-7.3,2.1-13.7,5.5-17.9C604.5,182.6,609.9,180.5,616.1,180.5z"/>
  <path fill="#0B41CD" d="M494.8,277v-75.4c0-6.3,1.8-11.4,5.3-15.1c3.6-3.7,8-5.6,13.5-5.6c5.4,0,9.9,1.9,13.5,5.6c3.6,3.7,5.3,8.7,5.3,15.1V277h22.3v-80.1c0-11.6-3-20.6-9-27.1s-14.2-9.7-24.6-9.7c-5.7,0-10.8,1.1-15.6,3.4c-4.7,2.3-8.5,5.3-10.6,8.5v-57.3h-22.3V277H494.8z"/>
  <path fill="#0B41CD" d="M392.8,232c0,8.4,1.9,15.2,5.6,19.9c3.8,4.7,9.2,6.8,15.3,6.8c11,0,17.9-7.1,20.5-21.2l20.7,4.8c-1.7,11.8-6,21-12.9,27.5s-16.3,9.8-28.3,9.8c-13,0-23.5-4.4-31.4-13.2c-7.9-8.8-11.9-20.8-11.9-35.8V209c0-15,3.9-27,11.9-35.8c7.9-8.8,18.4-13.2,31.4-13.2c12,0,21.4,3.3,28.3,9.8s11.2,15.7,12.9,27.5l-20.7,4.8c-2.6-14.1-9.4-21.2-20.5-21.2c-6.1,0-11.6,2.1-15.3,6.8c-3.8,4.7-5.6,11.4-5.6,19.9V232z"/>
  <path fill="#0B41CD" d="M310.3,258.7c-6.1,0-11.5-2.2-15.2-6.9c-3.7-4.8-5.5-11.6-5.5-20v-24.2c0-8.4,1.8-15.2,5.5-19.9s9.1-6.8,15.2-6.8s11.5,2.1,15.2,6.8s5.5,11.4,5.5,19.9v24.2c0,8.4-1.8,15.2-5.5,20C321.8,256.6,316.4,258.7,310.3,258.7 M310.3,279.7c8.4,0,15.9-2,22.4-5.9c6.5-4,11.6-9.7,15.2-17c3.6-7.4,5.4-16,5.4-25.8v-22.1c0-9.8-1.8-18.4-5.4-25.8c-3.6-7.4-8.7-13-15.2-17s-14-6-22.4-6s-15.9,2-22.4,6s-11.6,9.7-15.2,17c-3.6,7.4-5.4,16-5.4,25.8V231c0,9.8,1.8,18.4,5.4,25.8c3.6,7.4,8.7,13,15.2,17C294.4,277.7,301.9,279.7,310.3,279.7"/>
  <path fill="#0B41CD" d="M190.9,183.2v-47.3h22.5c6,0,10.7,1.9,14,5.8c3.3,3.9,5,9.8,5,17.9c0,8-1.7,14-5,17.9s-8,5.8-14,5.8L190.9,183.2L190.9,183.2z M190.9,277v-72.4H210c5.5,0,9.1,1.3,11.5,3.8s3.7,6.5,4.4,12.2l6.3,56.4h22.4l-6.7-58.5c-0.8-7-1.7-11.6-4.5-15.7c-2.6-3.7-6.3-6.8-10.6-8.2c6.8-3.2,12.2-7.8,16.1-13.6c3.9-5.8,5.9-13.8,5.9-24c0-13.1-3.7-23.5-11-31.1c-7.4-7.6-17.5-11.4-30.3-11.4h-44.8V277H190.9z"/>
  <path fill="#0B41CD" d="M800,207.9L619.3,415.8H180.7L0,207.9L180.7,0h438.5L800,207.9z M609.6,394.7L772,207.9L609.6,21.1H190.3L28,207.9l162.3,186.8H609.6z"/>
</svg>`;

function blockToEmailHTML(kind, props, primary, heroBg) {
  switch (kind) {
    case 'header': {
      const bg = esc(props.bgColor || '#FFF7F5');
      const fs = Number(props.fontSize) || 26;
      const headline = esc(props.headline || '');
      const flipped = !!props.flipped;
      const showLogo = props.showLogo !== false;
      const img = props.img || '';
      const logoCell = showLogo ? `<td style="padding:0 0 10px;">${ROCHE_LOGO_SVG}</td>` : '';

      const leftTd = `<td width="410" bgcolor="${bg}" valign="middle" style="width:410px;height:205px;background-color:${bg};padding:24px 20px;vertical-align:middle;">
        ${showLogo ? `<table border="0" cellpadding="0" cellspacing="0"><tr>${logoCell}</tr></table>` : ''}
        <p style="font-family:Arial,Helvetica,sans-serif;font-weight:300;font-size:${fs}px;line-height:1.22;color:#000000;margin:0;">${headline}</p>
      </td>`;

      const rightTd = img
        ? `<td width="340" style="width:340px;height:205px;background:url(${img}) no-repeat center/cover;background-color:#d8d5d0;">&nbsp;</td>`
        : `<td width="340" style="width:340px;height:205px;background-color:#d8d5d0;">&nbsp;</td>`;

      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0" style="width:750px;min-width:750px;">
        <tr height="205">${flipped ? rightTd + leftTd : leftTd + rightTd}</tr>
      </table>`;
    }

    case 'hero': {
      const eyebrow = esc(props.eyebrow || '');
      const title = esc(props.title || '');
      const copy = esc(props.copy || '');
      const cta = esc(props.cta || '');
      const href = esc(props.href || '#');
      const img = props.img || '';
      const imgH = Number(props.img_h) || 300;
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0" bgcolor="${heroBg}" style="background-color:${heroBg};">
        ${img ? `<tr><td><img src="${img}" width="750" height="${imgH}" alt="" style="display:block;width:100%;height:${imgH}px;object-fit:cover;" /></td></tr>` : ''}
        <tr><td style="padding:32px;">
          ${eyebrow ? `<p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#706B69;font-weight:500;margin:0 0 12px;">${eyebrow}</p>` : ''}
          <h1 style="font-family:Arial,sans-serif;font-weight:300;font-size:32px;line-height:1.1;letter-spacing:-0.02em;color:#544F4F;margin:0 0 12px;">${title}</h1>
          <p style="font-family:Arial,sans-serif;font-weight:300;font-size:18px;line-height:1.55;color:#544F4F;margin:0 0 18px;">${copy}</p>
          ${cta ? `<a href="${href}" style="display:inline-block;padding:11px 22px;background-color:${primary};color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:500;">${cta}</a>` : ''}
        </td></tr>
      </table>`;
    }

    case 'text': {
      const heading = esc(props.heading || '');
      const bgColor = props.bg_color || '';
      const isDark = ['#0066CC', '#003366', '#1a1a1a', '#000000'].includes(bgColor);
      const textColor = isDark ? '#ffffff' : '#544F4F';
      const paras = (props.copy || '').split(/\n\n+/).map(p =>
        `<p style="font-family:Arial,sans-serif;font-weight:300;font-size:18px;line-height:1.55;color:${textColor};margin:0 0 12px;">${esc(p)}</p>`
      ).join('');
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0"${bgColor ? ` bgcolor="${bgColor}" style="background-color:${bgColor};"` : ''}>
        <tr><td style="padding:24px 32px;">
          ${heading ? `<h2 style="font-family:Arial,sans-serif;font-weight:400;font-size:20px;line-height:1.3;color:${textColor};margin:0 0 10px;">${heading}</h2>` : ''}
          ${paras}
        </td></tr>
      </table>`;
    }

    case 'letter': {
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:24px 32px;font-family:Arial,sans-serif;font-weight:300;font-size:18px;line-height:1.65;color:#544F4F;text-align:${props.align || 'left'};">
          ${props.html || ''}
        </td></tr>
      </table>`;
    }

    case 'image': {
      const img = props.img || '';
      const imgH = Number(props.img_h) || 260;
      const imgW = Number(props.img_w) || 100;
      const caption = esc(props.caption || '');
      const pxW = Math.round(750 * imgW / 100);
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        ${img ? `<tr><td align="center"><img src="${img}" width="${pxW}" height="${imgH}" alt="" style="display:block;max-width:100%;height:${imgH}px;object-fit:cover;" /></td></tr>` : ''}
        ${caption ? `<tr><td style="padding:8px 32px 18px;font-family:Arial,sans-serif;font-size:11px;color:#706B69;font-style:italic;">${caption}</td></tr>` : ''}
      </table>`;
    }

    case 'gallery': {
      const imgs = ['img1', 'img2', 'img3'];
      const cells = imgs.map((k, i) => {
        const src = props[k] || '';
        const h = Number(props[`${k}_h`]) || 140;
        return src
          ? `<td width="228" style="padding:0 3px;"><img src="${src}" width="228" height="${h}" alt="" style="display:block;width:228px;height:${h}px;object-fit:cover;" /></td>`
          : `<td width="228" style="padding:0 3px;background-color:#DBD6D1;height:${h}px;">&nbsp;</td>`;
      });
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:20px 32px;">
          <table border="0" cellpadding="0" cellspacing="0"><tr>${cells.join('')}</tr></table>
        </td></tr>
      </table>`;
    }

    case 'twocol': {
      const cells = ['a', 'b'].map(k => {
        const img = props[`${k}_img`] || '';
        const imgH = Number(props[`${k}_img_h`]) || 140;
        const title = esc(props[`${k}_title`] || '');
        const copy = esc(props[`${k}_copy`] || '');
        const cta = esc(props[`${k}_cta`] || '');
        const href = esc(props[`${k}_href`] || '#');
        return `<td width="336" valign="top" style="vertical-align:top;padding:0 9px;">
          ${img ? `<img src="${img}" width="336" height="${imgH}" alt="" style="display:block;width:336px;height:${imgH}px;object-fit:cover;margin-bottom:10px;" />` : `<div style="width:336px;height:${imgH}px;background-color:#DBD6D1;margin-bottom:10px;">&nbsp;</div>`}
          <h3 style="font-family:Arial,sans-serif;font-weight:300;font-size:22px;line-height:1.2;color:#544F4F;margin:0 0 8px;">${title}</h3>
          <p style="font-family:Arial,sans-serif;font-weight:300;font-size:16px;line-height:1.5;color:#544F4F;margin:0 0 8px;">${copy}</p>
          ${cta ? `<a href="${href}" style="font-family:Arial,sans-serif;font-size:16px;color:${primary};text-decoration:none;">${cta}</a>` : ''}
        </td>`;
      });
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:24px 23px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>${cells.join('')}</tr></table>
        </td></tr>
      </table>`;
    }

    case 'threecol': {
      const imgH = Number(props.img_h) || 110;
      const cells = ['a', 'b', 'c'].map(k => {
        const img = props[`${k}_img`] || '';
        const title = esc(props[`${k}_title`] || '');
        const copy = esc(props[`${k}_copy`] || '');
        const cta = esc(props[`${k}_cta`] || '');
        const href = esc(props[`${k}_href`] || '#');
        return `<td width="214" valign="top" style="vertical-align:top;padding:0 6px;">
          ${img ? `<img src="${img}" width="214" height="${imgH}" alt="" style="display:block;width:214px;height:${imgH}px;object-fit:cover;margin-bottom:8px;" />` : `<div style="width:214px;height:${imgH}px;background-color:#DBD6D1;margin-bottom:8px;">&nbsp;</div>`}
          <h3 style="font-family:Arial,sans-serif;font-weight:300;font-size:20px;line-height:1.2;color:#544F4F;margin:0 0 6px;">${title}</h3>
          <p style="font-family:Arial,sans-serif;font-weight:300;font-size:15px;line-height:1.5;color:#544F4F;margin:0 0 6px;">${copy}</p>
          ${cta ? `<a href="${href}" style="font-family:Arial,sans-serif;font-size:15px;color:${primary};text-decoration:none;">${cta}</a>` : ''}
        </td>`;
      });
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:24px 26px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>${cells.join('')}</tr></table>
        </td></tr>
      </table>`;
    }

    case 'storylist': {
      const count = Math.max(1, Math.min(6, Number(props.count) || 3));
      const imgH = Number(props.img_h) || 160;
      const rows = [];
      for (let i = 1; i <= count; i++) {
        const k = `s${i}`;
        const img = props[`${k}_img`] || '';
        const title = esc(props[`${k}_title`] || '');
        const copy = esc(props[`${k}_copy`] || '');
        const cta = esc(props[`${k}_cta`] || '');
        const href = esc(props[`${k}_href`] || '#');
        if (i > 1) rows.push(`<tr><td colspan="3" height="1" style="height:1px;background-color:rgba(10,16,32,0.12);padding:0;font-size:0;line-height:0;">&nbsp;</td></tr>`);
        rows.push(`<tr>
          <td width="200" valign="top" style="vertical-align:top;padding:20px 24px 20px 0;">
            ${img ? `<img src="${img}" width="200" height="${imgH}" alt="" style="display:block;width:200px;height:${imgH}px;object-fit:cover;" />` : `<div style="width:200px;height:${imgH}px;background-color:#DBD6D1;">&nbsp;</div>`}
          </td>
          <td valign="top" style="vertical-align:top;padding:20px 0;">
            <h3 style="font-family:Arial,sans-serif;font-weight:300;font-size:22px;line-height:1.25;color:#544F4F;margin:0 0 8px;">${title}</h3>
            <p style="font-family:Arial,sans-serif;font-weight:300;font-size:16px;line-height:1.55;color:#544F4F;margin:0 0 8px;">${copy}</p>
            ${cta ? `<a href="${href}" style="font-family:Arial,sans-serif;font-size:16px;color:${primary};text-decoration:none;">${cta}</a>` : ''}
          </td>
        </tr>`);
      }
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:20px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">${rows.join('')}</table>
        </td></tr>
      </table>`;
    }

    case 'button': {
      const label = esc(props.label || 'Read more');
      const href = esc(props.href || '#');
      const align = props.align || 'center';
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td align="${align}" style="padding:16px 32px;">
          <a href="${href}" style="display:inline-block;padding:12px 26px;background-color:${primary};color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:500;">${label}</a>
        </td></tr>
      </table>`;
    }

    case 'divider':
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:16px 32px;"><div style="height:1px;background-color:rgba(10,16,32,0.12);font-size:0;line-height:0;">&nbsp;</div></td></tr>
      </table>`;

    case 'quote': {
      const text = esc(props.text || '');
      const attrib = esc(props.attrib || '');
      const width = Number(props.width) || 100;
      const pxW = Math.round(686 * width / 100);
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:24px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="${pxW}" style="margin:0 auto;">
            <tr>
              <td width="2" bgcolor="${primary}" style="background-color:${primary};">&nbsp;</td>
              <td style="padding:0 0 0 18px;">
                <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:300;font-size:26px;line-height:1.35;color:#544F4F;margin:0 0 14px;">&ldquo;${text}&rdquo;</p>
                ${attrib ? `<p style="font-style:normal;font-family:Arial,sans-serif;font-size:12px;color:#706B69;margin:0;">&mdash; ${attrib}</p>` : ''}
              </td>
            </tr>
          </table>
        </td></tr>
      </table>`;
    }

    case 'video': {
      const thumb = props.thumb || '';
      const href = esc(props.href || '#');
      const caption = esc(props.caption || '');
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:16px 32px;">
          <a href="${href}" style="display:block;text-decoration:none;position:relative;">
            ${thumb ? `<img src="${thumb}" width="686" alt="Video thumbnail" style="display:block;width:100%;max-width:686px;" />` : `<div style="width:686px;height:386px;background-color:#1a1a1a;">&nbsp;</div>`}
            <table border="0" cellpadding="0" cellspacing="0" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><tr><td align="center" width="56" height="56" style="width:56px;height:56px;border-radius:50%;background-color:rgba(255,255,255,0.92);text-align:center;vertical-align:middle;">
              <span style="font-size:18px;color:${primary};margin-left:3px;">&#9654;</span>
            </td></tr></table>
          </a>
          ${caption ? `<p style="font-family:Arial,sans-serif;font-size:11px;color:#706B69;font-style:italic;margin:8px 0 0;">${caption}</p>` : ''}
        </td></tr>
      </table>`;
    }

    case 'podcast': {
      const artwork = props.artwork || '';
      const show = esc(props.show || '');
      const episode = esc(props.episode || '');
      const host = esc(props.host || '');
      const duration = esc(props.duration || '');
      const href = esc(props.href || '#');
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:16px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="686" bgcolor="#FFF7F5" style="border:1px solid rgba(10,16,32,0.12);background-color:#FFF7F5;">
            <tr>
              <td width="140" style="padding:16px;vertical-align:top;">
                ${artwork ? `<img src="${artwork}" width="140" height="140" alt="Podcast artwork" style="display:block;width:140px;height:140px;object-fit:cover;" />` : `<div style="width:140px;height:140px;background:linear-gradient(135deg,#1a3a8a,#0b2154);">&nbsp;</div>`}
              </td>
              <td style="padding:16px 16px 16px 0;vertical-align:top;">
                <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#706B69;font-weight:600;margin:0 0 4px;">${show}</p>
                <p style="font-family:Arial,sans-serif;font-size:16px;font-weight:600;color:#544F4F;margin:0 0 4px;line-height:1.3;">${episode}</p>
                <p style="font-family:Arial,sans-serif;font-size:12px;color:#706B69;margin:0 0 16px;">${host}</p>
                <a href="${href}" style="display:inline-block;padding:8px 20px;background-color:${primary};color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:500;">&#9654; Listen &middot; ${duration}</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>`;
    }

    case 'language': {
      const note = esc(props.note || '');
      const prompt = esc(props.prompt || '');
      const examples = esc(props.examples || '');
      const langs = (props.languages || '').split('|').map(s => s.trim()).filter(Boolean);
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:8px 32px 20px;text-align:center;">
          <p style="font-family:Arial,sans-serif;font-size:12px;font-style:italic;color:#706B69;margin:0 0 4px;">${note}</p>
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#544F4F;margin:0 0 6px;">${prompt}</p>
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#544F4F;margin:0;">
            ${examples} ${langs.map((l, i) => (i > 0 ? '<span style="margin:0 6px;color:#706B69;">/</span>' : '') + `<a href="#" style="color:${primary};text-decoration:underline;">${l}</a>`).join('')}
          </p>
        </td></tr>
      </table>`;
    }

    case 'mediaform': {
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding:28px 32px;">
          ${props.title ? `<h2 style="font-family:Arial,sans-serif;font-weight:300;font-size:24px;color:#544F4F;margin:0 0 16px;">${esc(props.title)}</h2>` : ''}
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#706B69;margin:0 0 16px;line-height:1.5;">Please complete the registration form by clicking the button below.</p>
          <a href="#" style="display:inline-block;padding:11px 28px;background-color:${primary};color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;">${esc(props.submit_label || 'Submit')}</a>
        </td></tr>
      </table>`;
    }

    case 'footer': {
      const address = esc(props.address || '');
      const links = esc(props.links || '');
      const legal = esc(props.legal || '');
      return `<table role="presentation" width="750" border="0" cellpadding="0" cellspacing="0" bgcolor="#f7f5f2" style="background-color:#f7f5f2;border-top:1px solid rgba(10,16,32,0.12);">
        <tr><td style="padding:24px 20px 28px;">
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#706B69;line-height:1.6;margin:0 0 12px;">${address}</p>
          <div style="height:1px;background-color:rgba(10,16,32,0.12);margin:12px 0;font-size:0;line-height:0;">&nbsp;</div>
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#706B69;line-height:1.6;margin:0 0 8px;">${links}</p>
          <p style="font-family:Arial,sans-serif;font-size:10px;color:#706B69;margin:0;line-height:1.5;">${legal}</p>
        </td></tr>
      </table>`;
    }

    default:
      return '';
  }
}

export function generateEmailHTML(blocks, settings) {
  const primary = settings.brand?.primary || '#0B41CD';
  const heroBg = settings.brand?.heroBg || '#FFF7F5';
  const subject = settings.subject || '';
  const preheader = settings.preheader || '';

  const blockHTMLs = blocks.map(b => blockToEmailHTML(b.kind, b.props, primary, heroBg)).join('\n');

  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(subject)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  body { margin: 0; padding: 0; background-color: #f5f5f2; font-family: Arial, Helvetica, sans-serif; }
  table { border-collapse: collapse; }
  img { border: 0; display: block; -ms-interpolation-mode: bicubic; }
  a { color: ${primary}; }
  @media only screen and (max-width: 600px) {
    .email-container { width: 100% !important; min-width: 100% !important; }
    .stack-column { display: block !important; width: 100% !important; }
    img { width: 100% !important; height: auto !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f2;">
<!-- Preheader text -->
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">${esc(preheader)}</div>

<!-- Email wrapper -->
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f5f2" style="background-color:#f5f5f2;">
<tr><td align="center" style="padding:20px 0;">

  <!-- Email container: 750px -->
  <table role="presentation" class="email-container" width="750" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:750px;max-width:750px;background-color:#ffffff;">
    <!-- From: ${esc(settings.fromName)} <${esc(settings.fromEmail)}> -->

${blockHTMLs}

  </table>
  <!-- /Email container -->

</td></tr>
</table>
<!-- /Email wrapper -->
</body>
</html>`;
}

export function downloadEmailHTML(blocks, settings, emailName) {
  const html = generateEmailHTML(blocks, settings);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (emailName || 'email').replace(/[^a-z0-9\-_]/gi, '_') + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
