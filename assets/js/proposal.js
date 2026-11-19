/* ══════════════════════════════════════════════════════
   PROPOSAL — 《人生重启局》/ LIFE, RESTART
   Full programme proposal, typeset in both languages.
   ──────────────────────────────────────────────────────
   PROPOSAL.pages → content blocks
   ProposalDoc    → turns them into .sheet elements
   ══════════════════════════════════════════════════════ */

const L = (zh, en) => ({ zh: zh, en: en });

/* where this script lives — the cover image is resolved against it, so the same
   file works from index.html and from assets/doc/print.html */
const PROPOSAL_BASE = (function () {
  const self = document.currentScript;
  if (!self || !self.src) return "";
  return self.src.replace(/js\/proposal\.js(\?.*)?$/, "");
})();

const PROPOSAL = {
  title: L("人生重启局", "Life, Restart"),
  titleEn: "Life, Restart",
  sub: L("全国首档 AI 互动连续剧情真人网络节目", "China's first AI-assisted interactive drama series"),
  slogan: L("你的每一次选择，都可能改变一个人的人生。", "Every choice you make can change someone's life."),
  year: "2026",

  toc: [
    { n: "01", t: L("节目基本信息", "Programme basics"), p: 1 },
    { n: "02", t: L("项目概述", "Project overview"), p: 1 },
    { n: "03", t: L("节目定位", "Positioning"), p: 2 },
    { n: "04", t: L("节目形式与流程设计", "Format and flow"), p: 2 },
    { n: "05", t: L("主持人角色定位与价值", "The host's role"), p: 3 },
    { n: "06", t: L("节目特色与创新点", "What is new here"), p: 3 },
    { n: "07", t: L("对标节目分析", "Benchmarks"), p: 4 },
    { n: "08", t: L("市场分析与预期", "Market and forecast"), p: 4 },
    { n: "09", t: L("商业模式设计", "Business model"), p: 5 },
    { n: "10", t: L("第一期投销剧本", "Episode one script"), p: 6 },
    { n: "11", t: L("风险与应对措施", "Risk and mitigation"), p: 8 }
  ],

  pages: [
    /* ── 1 ───────────────────────────────── */
    {
      n: 1,
      blocks: [
        { t: "h2", n: "01", v: L("节目基本信息", "Programme basics") },
        { t: "p", v: L(
          "选题说明：结合行业趋势判断，AI 互动真人剧情类网络节目，是继微短剧之后最具潜力的千亿级内容赛道。当下单向观看的内容已进入瓶颈，观众从“被动看剧”转向“主动参与剧情”，互动式内容成为年轻用户核心需求。本次提案《人生重启局》聚焦该赛道，同时充分发挥网络播音主持人的核心价值，解答“互联网时代播音主持的发展出路”这一课程核心问题。",
          "Why this, why now: AI interactive live-action drama is the most promising content track after the micro-drama — a market already measured in hundreds of billions. One-way viewing has reached its ceiling; audiences have moved from watching a story to taking part in one, and interaction has become the core demand of young users. LIFE, RESTART enters that track, and at the same time answers the question this course keeps asking — where broadcasting and hosting can go in the internet age."
        ) },
        { t: "dl", items: [
          { k: L("主标题", "Working title"), v: L("《人生重启局》", "Life, Restart") },
          { k: L("备选名称", "Alternatives"), v: L("《你来决定 TA 的命运》《如果重来一次》《AI 人生选择局》《下一步，由你决定》",
            "You Decide Their Fate · If We Could Start Again · The AI Life Choice · Your Move") },
          { k: L("副标题", "Subtitle"), v: L("全国首档 AI 互动连续剧情真人网络节目",
            "China's first AI-assisted interactive drama series") },
          { k: L("节目类型", "Genre"), v: L("AI 互动连续剧情真人网络节目",
            "Serialised live-action drama with AI-generated branches") },
          { k: L("节目口号", "Tagline"), v: L("你的每一次选择，都可能改变一个人的人生",
            "Every choice you make can change someone's life") }
        ] },

        { t: "h2", n: "02", v: L("项目概述", "Project overview") },
        { t: "p", v: L(
          "近年来微短剧市场爆发式增长，现已成为互联网内容核心赛道。2025 年市场规模突破 1500 亿元，证明了短平快、强情绪的内容形态拥有巨大商业价值。但当前绝大多数网络节目仍采用单向传播模式，观众只能被动观看内容，无法深度参与内容生产与剧情走向。",
          "The micro-drama market has grown explosively in recent years and is now a core track of internet content. In 2025 it passed RMB 150 billion, proof that short, fast, emotionally direct content carries enormous commercial weight. Yet almost every web programme still broadcasts in one direction: the audience can only watch, and can take no real part in production or in where the story goes."
        ) },
        { t: "p", v: L(
          "生成内容技术的成熟，为网络节目形态创新提供了革命性可能。本项目拟打造一档融合 AI 生成内容、剧情互动、网络主持与观众共创于一体的新型互联网节目《人生重启局》。节目通过主持人引导、AI 辅助生成多分支剧情以及观众实时投票决策的方式，共同构建一个持续发展的动态故事世界。观众不再是单纯的观看者，更是剧情的参与者、决定者和共创者。",
          "Mature generative tools make a different format possible. LIFE, RESTART brings AI-generated content, interactive storytelling, hosted presentation and audience co-creation into one programme. With the host guiding the room, AI generating branching storylines and viewers voting in real time, it builds a story world that keeps developing. The audience is no longer only watching: it takes part, decides, and co-creates."
        ) },
        { t: "p", v: L(
          "短视频形式传播，通过日更或周更的连续更新机制培养用户追更习惯，探索“内容共创”时代网络节目发展的新方向，有望成为继微短剧之后的下一代现象级内容形态。",
          "Distributed in short-video form and updated weekly or daily, the show is built to create the habit of following along — a new direction for web programming in the age of content co-creation, and potentially the next phenomenon-level format after the micro-drama."
        ) }
      ]
    },

    /* ── 2 ───────────────────────────────── */
    {
      n: 2,
      blocks: [
        { t: "h2", n: "03", v: L("节目定位", "Positioning") },
        { t: "ol", items: [
          { k: L("核心定位", "Core position"), v: L("由观众共同决定主人公命运走向的互动型网络节目。",
            "An interactive web programme in which the audience decides the protagonist's fate.") },
          { k: L("目标受众", "Audience"), v: L("18–35 岁互联网核心用户，重点覆盖大学生群体、初入职场青年、短视频重度用户及网络互动内容爱好者。",
            "Core internet users aged 18–35, focused on university students, young people in their first jobs, heavy short-video users and fans of interactive content.") },
          { k: L("播出平台", "Platforms"), v: L("抖音、快手、视频号、B 站、小红书全平台分发。",
            "Douyin, Kuaishou, WeChat Channels, Bilibili and Xiaohongshu — full-platform distribution.") },
          { k: L("节目时长", "Length"), v: L("单期 5–8 分钟。", "Five to eight minutes per episode.") },
          { k: L("更新频率", "Schedule"), v: L("初期周更 2 期，热度稳定后转为日更。",
            "Twice weekly at launch; daily once momentum is established.") }
        ] },

        { t: "h2", n: "04", v: L("节目形式与流程设计", "Format and flow") },
        { t: "h3", v: L("（一）每期标准节目结构", "(a) The standard episode") },
        {
          t: "table",
          head: [L("环节", "Beat"), L("时长", "Length"), L("核心内容", "What happens")],
          rows: [
            [L("剧情回顾", "Recap"), L("30 秒", "30 s"), L("主持人快速梳理上一期关键剧情与观众选择结果，帮助新观众快速入戏。",
              "The host recaps last week's story and the result of the vote, so a new viewer can join immediately.")],
            [L("剧情推进", "Advance"), L("2 分钟", "2 min"), L("通过真人表演结合 AI 生成视频呈现本期故事发展，保持紧凑节奏。",
              "Live-action performance combined with AI-generated footage carries this episode's story at a tight pace.")],
            [L("关键冲突", "The choice"), L("1 分钟", "1 min"), L("设置人物面临的核心人生选择，聚焦就业、创业、爱情、家庭、梦想与现实等强共鸣现实议题。",
              "The protagonist faces one core decision — work, starting a business, love, family, ambition against reality.")],
            [L("主持人分析", "The host's read"), L("1 分钟", "1 min"), L("主持人客观分析不同选择的利弊与可能后果，引导观众深度思考。",
              "The host weighs what each option costs and what it might lead to, and pushes the audience to think it through.")],
            [L("观众决策", "The vote"), L("30 秒", "30 s"), L("发起平台互动投票，公布下一期剧情将根据最高票数结果推进。",
              "A platform poll opens; the next episode follows whichever option wins.")]
          ]
        },
        { t: "h3", v: L("（二）长期内容规划", "(b) The long game") },
        { t: "p", v: L(
          "“元季播 + 主线延续”模式。第一季聚焦“职场前三年”的人生阶段，设置 12 个核心选择节点，形成完整的故事线。每完成一个大的人生阶段——职场初期、恋爱婚姻、职业转型等——开启新一季内容。同时，为高人气的剧情分支制作番外篇，满足不同观众的内容需求。",
          "A “meta-season” model with a continuous main line. Season one covers the first three years of a career and sets twelve core choice points into one complete storyline. Each time a life stage closes — early career, love and marriage, a change of profession — a new season opens. Popular branches also get spin-off episodes, so the parts of the audience that voted differently still get their story."
        ) }
      ]
    },

    /* ── 3 ───────────────────────────────── */
    {
      n: 3,
      blocks: [
        { t: "h2", n: "05", v: L("主持人角色定位与价值", "The host's role") },
        { t: "p", v: L(
          "本节目彻底颠覆传统主持人的串场功能，将主持人打造为节目核心灵魂人物，承担四大核心角色：",
          "The programme overturns the host's traditional job of linking segments. The host becomes the centre of the show, carrying four roles at once:"
        ) },
        { t: "ol", items: [
          { k: L("剧情引导官", "Story guide"), v: L("用富有感染力的语言讲述故事，把控节目节奏，营造沉浸式氛围。",
            "Tells the story in language that carries, holds the rhythm, builds a room you can walk into.") },
          { k: L("互动发起人", "Host of the interaction"), v: L("在关键节点抛出问题，引导观众参与讨论与投票。",
            "Puts the question at the decisive moment and brings the audience into the argument and the vote.") },
          { k: L("观众代言人", "Voice of the audience"), v: L("代表观众表达观点，梳理不同立场的核心诉求。",
            "Speaks for the viewers, sorting out what each side is really asking for.") },
          { k: L("内容评论员", "Commentator"), v: L("结合社会热点与人生经验，对剧情选择进行深度解读，提升节目思想性。",
            "Reads the choice against the news and against lived experience, which is where the programme earns its seriousness.") }
        ] },
        { t: "p", v: L(
          "AI 可以高效生成剧情内容，但无法建立人与人之间真实的情感连接。主持人作为连接 AI 内容与观众情感的桥梁，是节目不可替代的核心竞争力。播音主持专业的语言表达能力、情绪调动能力和现场把控能力，在这一新型节目形态中得到了最大化发挥。",
          "AI can generate plot efficiently, but it cannot build a real emotional connection between people. The host is the bridge between generated content and audience feeling — the part of the show that cannot be replaced. The skills of a broadcasting and hosting degree — language, emotional control, holding a room — are used here at full strength."
        ) },
        { t: "p", v: L(
          "传统观点认为互联网弱化了主持人角色，但本节目证明：互动类网络节目恰恰需要专业网络播音主持人。主持人不再是简单串场，而是情绪引导、观点输出、观众连接的核心，是 AI 技术无法替代的人文核心，也是网络播音主持专业在新媒体时代的重要就业方向。",
          "The conventional view is that the internet weakened the host's role. This programme argues the opposite: interactive web programming needs a professional host more than ever. Not a link between segments, but the centre of emotion, opinion and connection — the human core AI cannot replace, and a real career direction for broadcasting graduates in the new media era."
        ) },

        { t: "h2", n: "06", v: L("节目特色与创新点", "What is new here") },
        { t: "ol", items: [
          { k: L("观众决定剧情发展", "The audience decides"), v: L("打破传统短剧“编剧定结局”的单向模式，每一个关键节点都由观众投票决定，让观众真正成为内容的主人。",
            "Breaks the “the writer decides the ending” model: every key turn is settled by vote, which makes the audience the owner of the story.") },
          { k: L("AI 辅助内容生产", "AI-assisted production"), v: L("利用 AI 技术快速生成多分支剧情脚本、辅助视频制作，大幅提高内容生产效率，降低制作成本，实现高频更新。",
            "AI writes branch scripts and supports video production, which raises output and cuts cost enough to sustain a high-frequency schedule.") },
          { k: L("主持人深度参与叙事", "The host inside the story"), v: L("主持人不再是旁观者，而是深度融入故事，通过个人解读与互动引导形成独特的节目风格与个人 IP。",
            "Not an observer but a participant; the host's reading and guidance become the show's style and its own IP.") },
          { k: L("连续更新追更机制", "A reason to come back"), v: L("每一期都是下一期的前情提要，剧情环环相扣，培养用户长期追更习惯，大幅提升用户黏性与留存率。",
            "Each episode is the setup for the next. Hooks held between episodes build the habit of following and lift retention.") },
          { k: L("强现实共鸣", "Real stakes"), v: L("所有剧情选择均取材于当代年轻人真实的人生困境，极易引发情感共鸣与社交讨论。",
            "Every choice is drawn from a real dilemma of young people today — which is exactly what starts the argument in the comments.") }
        ] }
      ]
    },

    /* ── 4 ───────────────────────────────── */
    {
      n: 4,
      blocks: [
        { t: "h2", n: "07", v: L("对标节目分析", "Benchmarks") },
        { t: "h3", v: L("（一）国外参考", "(a) Abroad") },
        { t: "p", v: L(
          "《黑镜：潘达斯奈基》：开创了互动电影的先河，证明了观众参与剧情决策的内容形态具有强大吸引力。但受限于制作成本，只能提供有限的剧情分支，且为一次性内容，无法形成连续更新机制。",
          "Black Mirror: Bandersnatch opened the interactive film and proved that letting the audience decide has real pull. But production cost held it to a handful of branches, and it was a one-off — it could not become a returning series."
        ) },
        { t: "h3", v: L("（二）国内参考", "(b) At home") },
        { t: "ol", items: [
          { k: L("传统微短剧", "Micro-drama"), v: L("具备短时长、快节奏、强情绪的优势，但互动性不足，观众参与感低。",
            "Short, fast and emotionally strong — but barely interactive, so the audience watches rather than takes part.") },
          { k: L("直播互动节目", "Live interactive shows"), v: L("实时互动性强，但内容随机性大，难以形成完整连贯的剧情。",
            "Genuinely real-time, but too random to hold a coherent story together.") },
          { k: L("剧情类游戏直播", "Story-game streaming"), v: L("观众通过弹幕影响主播游戏选择，但本质上是游戏内容的二次传播。",
            "Viewers steer the streamer's choices by chat, but it remains a second-hand broadcast of someone else's game.") }
        ] },
        { t: "h3", v: L("（三）本项目创新优势", "(c) What this one does differently") },
        { t: "p", v: L(
          "本节目首次实现了“AI 生成多分支剧情 + 主持人专业引导 + 观众实时共创 + 连续更新机制”四位一体的融合创新，既保留了微短剧的内容优势，又解决了传统互动内容制作成本高、更新慢的痛点，同时充分发挥了主持人的核心价值。",
          "This is the first format to fuse four things at once: AI-generated branching plot, professional hosting, real-time co-creation and a serialised schedule. It keeps what micro-drama does well, solves what interactive content does badly — cost and slow turnaround — and gives the host a central role rather than a decorative one."
        ) },

        { t: "h2", n: "08", v: L("市场分析与预期", "Market and forecast") },
        { t: "h3", v: L("（一）市场背景", "(a) The backdrop") },
        { t: "p", v: L(
          "微短剧的成功本质在于它同时满足了高频消费、低理解门槛、强情绪驱动、容易规模化生产和商业化路径清晰等核心条件。但随着市场竞争加剧，微短剧内容同质化严重，用户审美疲劳逐渐显现，行业急需新的内容形态突破。",
          "Micro-drama worked because it met several conditions at once: high-frequency consumption, a low bar to understanding, strong emotional drive, easy scale, and a clear route to revenue. But as competition tightens the content has become homogeneous and audiences are tiring of it. The industry needs a new form."
        ) },
        { t: "p", v: L(
          "未来互联网内容的核心发展趋势是从“观看内容”转向“参与内容”。年轻一代用户不再满足于被动接受信息，他们渴望表达自我、影响他人、参与创造。互动式内容将成为下一个千亿级市场赛道。",
          "The direction of internet content is from watching to taking part. Young audiences are no longer satisfied with receiving information: they want to express themselves, influence others and help make the thing. Interactive content is the next hundred-billion market."
        ) }
      ]
    },

    /* ── 5 ───────────────────────────────── */
    {
      n: 5,
      blocks: [
        { t: "h3", v: L("（二）市场机会", "(b) The opening") },
        { t: "p", v: L(
          "目前国内尚未出现成熟的 AI 互动剧情网络节目，市场仍处于蓝海阶段。本节目作为赛道先行者，有望率先抢占用户心智，建立行业标准。从用户需求来看，18–35 岁年轻用户占互联网总时长的 60% 以上，他们更愿意为互动性强、参与感高的内容付费和传播。",
          "No mature AI interactive drama exists in China yet — the field is still open. As an early mover, the programme can occupy the audience's mind first and help set the standard. On the demand side, 18–35s account for more than 60% of total internet time, and they are the most willing to pay for — and pass on — content they can influence."
        ) },
        { t: "h3", v: L("（三）市场预期", "(c) The forecast") },
        { t: "p", v: L(
          "参考微短剧的发展路径，AI 互动剧情节目有望在未来 3–5 年内发展成为千亿级市场赛道。与传统微短剧相比，本节目具有更强的用户黏性、更高的用户留存和更多元的商业模式。",
          "Following the path micro-drama took, AI interactive drama can become a hundred-billion track within three to five years. Against traditional micro-drama it offers stronger attachment, higher retention and more ways to earn."
        ) },
        { t: "p", v: L(
          "《人生重启局》作为该赛道的标杆产品，预计上线 3 个月内单平台粉丝突破 100 万，单期平均播放量突破 500 万，半年内实现盈利，一年内完成 IP 化全产业链布局。长期来看，该节目模式可复制到悬疑、恋爱、宫斗、职场等多个题材领域，形成规模化内容矩阵。",
          "LIFE, RESTART is positioned as the benchmark product in that track: one million followers on a single platform within three months of launch, an average of five million views per episode, profitability within six months, and a full IP chain within a year. Longer term, the format transfers to mystery, romance, palace drama and workplace stories, forming a content matrix at scale."
        ) },

        { t: "h2", n: "09", v: L("商业模式设计", "Business model") },
        { t: "ol", items: [
          { k: L("广告植入", "Product placement"), v: L("将品牌信息自然融入剧情场景与主持人台词中，提供定制化剧情植入服务。",
            "Brand information written into scenes and into the host's lines, offered as bespoke story integration.") },
          { k: L("品牌冠名", "Title sponsorship"), v: L("引入节目总冠名、单期冠名等多种冠名形式。",
            "Full-season and single-episode title packages.") },
          { k: L("会员投票", "Membership votes"), v: L("推出会员专属投票权，会员可获得额外票数或参与特殊剧情分支投票。",
            "Members get extra votes, or access to votes on special branches.") },
          { k: L("付费剧情分支", "Paid branches"), v: L("为高人气的隐藏剧情分支设置付费解锁。",
            "Hidden, high-demand branches unlocked for a fee.") },
          { k: L("IP 开发", "IP development"), v: L("将热门剧情改编为传统微短剧、网络小说、有声书等。",
            "Popular storylines adapted into micro-drama, web novels and audiobooks.") },
          { k: L("衍生产品", "Merchandise and events"), v: L("开发节目相关的周边产品、线下体验活动等。",
            "Products and offline experiences built on the show.") },
          { k: L("电商导流", "Commerce links"), v: L("通过剧情场景植入商品链接，实现内容电商变现。",
            "Products placed inside scenes, turning the story into a storefront.") }
        ] }
      ]
    },

    /* ── 6 ───────────────────────────────── */
    {
      n: 6,
      blocks: [
        { t: "h2", n: "10", v: L("第一期投销剧本", "Episode one script") },
        { t: "lead", v: L("《毕业后的第一道选择题》", "“The First Choice After Graduation”") },
        { t: "kvrow", items: [
          { k: L("时长", "Runtime"), v: L("约 5 分钟", "approx. 5 minutes") },
          { k: L("植入品牌", "Placement"), v: L("某知名招聘 APP、某职场咖啡品牌", "A recruitment app; a workplace coffee brand") }
        ] },
        {
          t: "shots",
          head: [L("镜号", "Shot"), L("景别", "Framing"), L("画面内容", "Picture"), L("台词 / 音效", "Dialogue / sound"), L("时长", "Length"), L("商业植入", "Placement")],
          rows: [
            [L("1", "1"), L("中景", "Medium"),
             L("主持人出镜，背景为简约现代的演播室，墙上有“人生重启局”logo。",
               "Host to camera in a clean, modern studio; the LIFE, RESTART logo on the wall."),
             L("主持人：如果今天是你大学毕业的第一天，你的面前摆着两条路。一条路安全，一条路充满未知。你会怎么选？欢迎来到《人生重启局》，从今天开始，我们一起决定一个年轻人的人生。",
               "HOST: If today were the first day after graduation, and two roads were laid out in front of you — one safe, one completely unknown — which would you take? Welcome to LIFE, RESTART. From tonight, we decide a young person's life together."),
             L("30 秒", "30 s"), L("无", "—")],
            [L("2", "2"), L("蒙太奇", "Montage"),
             L("快速切换毕业照、扔学士帽、宿舍收拾行李的画面。",
               "Quick cuts: graduation photographs, caps thrown in the air, a dorm room being packed up."),
             L("背景音乐：轻快又略带伤感的毕业歌曲。",
               "MUSIC: a graduation song — bright, with a little sadness underneath."),
             L("20 秒", "20 s"), L("无", "—")],
            [L("3", "3"), L("近景", "Close"),
             L("主人公林然坐在书桌前，面前放着两份 offer，手机屏幕显示某招聘 APP 界面。",
               "Lin Ran at his desk with two offers in front of him; a recruitment app open on his phone."),
             L("旁白：林然，22 岁，刚刚大学毕业。和所有毕业生一样，他站在了人生的第一个十字路口。",
               "NARRATOR: Lin Ran, twenty-two, just out of university. Like every graduate, he is standing at his first crossroads."),
             L("30 秒", "30 s"),
             L("清晰展示某招聘 APP 的 logo 与界面，台词提及“我在 XX 招聘上投了上百份简历，终于拿到了这两个 offer”。",
               "The app's logo and interface clearly on screen; the line names it — “I sent a hundred applications on XX, and these two offers are what came back.”")],
            [L("4", "4"), L("特写", "Close-up"),
             L("两份 offer 的关键信息：大厂 offer 月薪 15000 元，创业公司 offer 月薪 8000 元加股份。",
               "The two offers in detail: a big-tech offer at RMB 15,000 a month; a start-up offer at RMB 8,000 plus equity."),
             L("主持人（画外音）：第一份，大型互联网企业，月薪 15000，五险一金齐全，工作稳定，发展路径清晰。第二份，一家只有十几人的初创公司，工资只有 8000，但老板承诺给 5% 的股份。",
               "HOST (V.O.): The first is a major internet company — 15,000 a month, full benefits, stable, a clear ladder. The second is a start-up of a dozen people — 8,000, and a promise of five percent of the company."),
             L("40 秒", "40 s"), L("无", "—")],
            [L("5", "5"), L("中景", "Medium"),
             L("林然和父母视频通话，父母劝他去大厂；切换到和朋友聊天，朋友鼓励他去创业公司。",
               "Lin Ran video-calls his parents, who push him towards the big company; cut to a friend, who pushes him the other way."),
             L("林然妈妈：去大厂多好啊，稳定体面，我们也放心。朋友：创业公司多有前途啊，万一成了，你就是元老了！",
               "MUM: A big company is wonderful — stable, respectable, and we can relax. FRIEND: A start-up is where the future is. If it works, you were there at the beginning."),
             L("50 秒", "50 s"), L("无", "—")],
            [L("6", "6"), L("近景", "Close"),
             L("林然端着一杯某品牌咖啡，看着窗外发呆。",
               "Lin Ran holding a branded coffee, staring out of the window."),
             L("主持人（出镜）：一边是确定的现在，一边是未知的未来。选择大厂，意味着稳定和体面，但也意味着激烈的竞争和按部就班的生活。选择创业公司，意味着无限的可能，但也可能血本无归，从头再来。主持人：如果是你，你会怎么选？选项 A：进入大厂，拥抱稳定。选项 B：加入创业公司，赌一个未来。",
               "HOST (to camera): On one side a settled present; on the other an unknown future. The big company means stability and respectability — and also fierce competition and a life on rails. The start-up means possibility without limit — and also the chance of losing everything and starting again. HOST: If it were you, what would you choose? Option A: take the big company, take the stability. Option B: join the start-up and bet on a future."),
             L("1 分钟", "1 min"),
             L("清晰展示某职场咖啡品牌的杯子，台词提及“赶了一晚上的方案，全靠这杯 XX 咖啡续命”。",
               "The coffee brand's cup clearly on screen; the line names it — “I spent the night on this deck, and this cup of XX is the only reason I'm still upright.”")],
            [L("7", "7"), L("中景", "Medium"),
             L("主持人站在投票板前，上面写着两个选项。",
               "The host stands at a voting board carrying the two options."),
             L("请在评论区投票，票数最高的结果，将决定林然下一期的人生方向。",
               "Vote in the comments. Whichever option wins decides where Lin Ran's life goes next week."),
             L("40 秒", "40 s"), L("无", "—")],
            [L("8", "8"), L("特写", "Close-up"),
             L("主持人微笑看向镜头。",
               "The host looks into the lens and smiles."),
             L("主持人：人生从来没有标准答案，但今天，你将成为答案的一部分。我们下一期见。字幕：《人生重启局》，未完待续。下期投票截止时间：本周五晚 8 点。",
               "HOST: There has never been a correct answer to a life. But tonight, you become part of one. See you next week. CAPTION: LIFE, RESTART — to be continued. Voting closes Friday, 8 p.m."),
             L("30 秒", "30 s"), L("无", "—")]
          ]
        }
      ]
    },

    /* ── 8 ───────────────────────────────── */
    {
      n: 8,
      blocks: [
        { t: "h2", n: "11", v: L("风险与应对措施", "Risk and mitigation") },
        { t: "ol", items: [
          { k: L("剧情分支压力", "Branch workload"), v: L("依托 AI 批量产出分支脚本与短视频素材，单期严格控制为 2 个核心选择，严控制作量。",
            "AI produces branch scripts and short-video material in batches; each episode is held to two core choices, which keeps the volume of production under control.") },
          { k: L("投票分散", "Split votes"), v: L("投票时长统一设置 24 小时，平台实时公示票数动态，引导剧情走向。",
            "Polling opens for a fixed 24 hours with live counts published, which keeps the story moving instead of stalling.") },
          { k: L("内容同质化", "Sameness"), v: L("除热点外，定期更换故事主线、主人公人设，拓展校园、婚恋、创业等多元题材。",
            "Beyond topical stories, the main line and the protagonist change on a schedule, extending into campus, romance and start-up subjects.") },
          { k: L("技术风险", "Technical failure"), v: L("提前搭建备用素材库与应急剪辑方案，规避 AI 生成故障。",
            "A reserve footage library and an emergency edit plan are prepared in advance, so a generation failure does not stop delivery.") }
        ] },
        { t: "close" }
      ]
    }
  ]
};

/* ══════════════════════════════════════════════════════
   RENDERER
   ══════════════════════════════════════════════════════ */
const ProposalDoc = (function () {
  const pick = (v, lang) => (v && (v[lang] || v.zh)) || "";
  const el = (tag, cls, txt) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  };

  function block(b, lang) {
    switch (b.t) {
      case "h2": {
        const h = el("h2", "t-h2");
        h.appendChild(el("span", "t-h2__n", b.n));
        h.appendChild(el("span", "t-h2__t", pick(b.v, lang)));
        return h;
      }
      case "h3": return el("h3", "t-h3", pick(b.v, lang));
      case "p":  return el("p", "t-p", pick(b.v, lang));
      case "lead": return el("p", "t-lead", pick(b.v, lang));
      case "end": return el("p", "t-end", pick(b.v, lang));
      case "close": {
        const box = el("section", "t-close");
        box.appendChild(el("p", "t-close__k",
          lang === "zh" ? "节目提案 · 2026 · 全文完" : "Programme proposal · 2026 · end"));
        const title = el("p", "t-close__t");
        title.innerHTML = lang === "zh" ? "人生重启局" : "Life, <em>Restart</em>";
        box.appendChild(title);
        box.appendChild(el("p", "t-close__s", "“" + pick(PROPOSAL.slogan, lang) + "”"));
        box.appendChild(el("p", "t-close__m", lang === "zh"
          ? "耿子严 · 播音与主持艺术 · 1807926008@qq.com"
          : "Ziyan Geng · Broadcasting & Hosting Art · 1807926008@qq.com"));
        return box;
      }

      case "dl":
      case "ol": {
        const list = el(b.t === "ol" ? "ol" : "dl", b.t === "ol" ? "t-ol" : "t-dl");
        b.items.forEach((it, i) => {
          const row = el("div", "t-row");
          const k = el("dt", "t-row__k");
          if (b.t === "ol") k.appendChild(el("span", "t-row__n", String(i + 1).padStart(2, "0")));
          k.appendChild(el("span", "t-row__kt", pick(it.k, lang)));
          row.appendChild(k);
          row.appendChild(el("dd", "t-row__v", pick(it.v, lang)));
          list.appendChild(row);
        });
        return list;
      }

      case "kvrow": {
        const box = el("div", "t-kv");
        b.items.forEach((it) => {
          const line = el("p", "t-kv__line");
          line.appendChild(el("span", "t-kv__k", pick(it.k, lang)));
          line.appendChild(el("span", "t-kv__v", pick(it.v, lang)));
          box.appendChild(line);
        });
        return box;
      }

      case "table":
      case "shots": {
        const wrap = el("div", "t-tablewrap" + (b.t === "shots" ? " t-tablewrap--shots" : ""));
        const table = el("table", "t-table");
        const thead = el("thead");
        const htr = el("tr");
        b.head.forEach((h, i) => {
          const th = el("th", "", pick(h, lang));
          th.dataset.i = String(i);
          htr.appendChild(th);
        });
        thead.appendChild(htr);
        const tbody = el("tbody");
        b.rows.forEach((r) => {
          const tr = el("tr");
          r.forEach((c, i) => {
            const td = el("td", "", pick(c, lang));
            td.dataset.k = pick(b.head[i], lang);
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.append(thead, tbody);
        wrap.appendChild(table);
        return wrap;
      }
      default: return null;
    }
  }

  function shell(num, lang, body) {
    const sheet = el("article", "sheet sheet--" + lang);
    sheet.dataset.page = String(num);

    const head = el("header", "sheet__head");
    head.appendChild(el("span", "sheet__run",
      lang === "zh" ? "人生重启局 · 节目提案" : "Life, Restart · programme proposal"));
    head.appendChild(el("span", "sheet__sec", String(num).padStart(2, "0")));

    const inner = el("div", "sheet__body");
    inner.appendChild(body);

    const foot = el("footer", "sheet__foot");
    foot.appendChild(el("span", "", lang === "zh" ? "《人生重启局》节目提案" : "LIFE, RESTART — proposal"));
    foot.appendChild(el("b", "", String(num)));

    sheet.append(head, inner, foot);
    return sheet;
  }

  function cover(lang) {
    const sheet = el("article", "sheet sheet--cover sheet--" + lang);
    sheet.dataset.page = "0";
    if (lang === "zh") {
      const img = el("img", "cover__art");
      img.src = PROPOSAL_BASE + "script/p01.jpg";
      img.alt = "《人生重启局》节目提案封面";
      sheet.appendChild(img);
    } else {
      const box = el("div", "cover");
      box.appendChild(el("span", "cover__top", "Programme proposal · " + PROPOSAL.year));
      const mid = el("div", "cover__mid");
      const h = el("h1", "cover__title");
      h.innerHTML = "Life,<br><em>Restart</em>";
      mid.appendChild(h);
      mid.appendChild(el("p", "cover__sub", PROPOSAL.sub.en));
      mid.appendChild(el("p", "cover__slogan", "“" + PROPOSAL.slogan.en + "”"));
      box.appendChild(mid);
      const foot = el("div", "cover__foot");
      foot.appendChild(el("span", "", "Ziyan Geng"));
      foot.appendChild(el("span", "", "MA Communication (AI & Digital Media) · BNU–HKBU UIC"));
      box.appendChild(foot);
      sheet.appendChild(box);
    }
    return sheet;
  }

  function toc(lang) {
    const sheet = el("article", "sheet sheet--toc sheet--" + lang);
    sheet.dataset.page = "0";
    const body = el("div", "toc");
    body.appendChild(el("p", "toc__k", lang === "zh" ? "节目提案" : "Programme proposal"));
    body.appendChild(el("h1", "toc__h", lang === "zh" ? "目录" : "Contents"));
    body.appendChild(el("p", "toc__lead", lang === "zh"
      ? "一档由观众投票决定主人公命运的 AI 互动连续剧。真人表演与 AI 生成的分支剧情构成每一期；在关键节点，主持人把选择交给观众，票数最高的分支就是下一期的故事。"
      : "An interactive drama in which the audience votes the protagonist's life forward. Each episode mixes live-action performance with AI-generated branches; at the decisive moment the host hands the choice to the audience, and the winning branch becomes next week's story."));

    const list = el("ol", "toc__list");
    PROPOSAL.toc.forEach((row) => {
      const li = el("li", "toc__row");
      li.appendChild(el("span", "toc__n", row.n));
      li.appendChild(el("span", "toc__t", pick(row.t, lang)));
      li.appendChild(el("span", "toc__d"));
      li.appendChild(el("span", "toc__p", String(row.p)));
      list.appendChild(li);
    });
    body.appendChild(list);

    const note = el("div", "toc__note");
    note.appendChild(el("p", "toc__note-k", lang === "zh" ? "一句话" : "In one line"));
    note.appendChild(el("p", "toc__note-v", pick(PROPOSAL.slogan, lang)));
    body.appendChild(note);

    const foot = el("div", "toc__foot");
    foot.appendChild(el("span", "", pick(PROPOSAL.title, lang) + " · " + PROPOSAL.year));
    foot.appendChild(el("span", "", lang === "zh" ? "耿子严" : "Ziyan Geng"));
    body.appendChild(foot);

    sheet.appendChild(body);
    return sheet;
  }

  function newSheet(lang) {
    const flow = el("div", "sheet__flow");
    return shell(0, lang, flow);
  }

  /* how much vertical room the flow has inside one sheet.
     the height comes from the 210:297 ratio, NOT from clientHeight — an
     aspect-ratio box grows when its content grows, which would hide overflow. */
  function availOf(sheet) {
    const cs = getComputedStyle(sheet);
    const body = sheet.querySelector(".sheet__body");
    const bc = getComputedStyle(body);
    const height = sheet.clientWidth * 297 / 210;
    return height
      - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      - sheet.querySelector(".sheet__head").offsetHeight
      - sheet.querySelector(".sheet__foot").offsetHeight
      - parseFloat(bc.paddingTop) - parseFloat(bc.paddingBottom)
      - 34;                              // safety margin for late webfont metrics
  }

  return {
    /* two passes: the first one makes the browser fetch every glyph it needs,
       the second one paginates against the metrics it will actually render with */
    async build(lang, host) {
      this.pass(lang, host);
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (e) {}
        this.pass(lang, host);
      }
      return { pages: host.querySelectorAll(".sheet").length };
    },

    /* flows the blocks into as many sheets as they need — no half-empty pages */
    pass(lang, host) {
      host.innerHTML = "";
      const coverSheet = cover(lang);
      const tocSheet = toc(lang);

      /* measure in a fixed-width off-screen column so page breaks never depend
         on how the container happens to be laid out at this instant */
      const meas = document.createElement("div");
      meas.className = "doc-meas";
      meas.style.width = Math.min(794, host.clientWidth || 794) + "px";
      document.body.appendChild(meas);

      const sheets = [];
      const secPage = {};
      let n = 1;
      const narrow = (host.clientWidth || 794) < 720;

      if (narrow) {
        /* phones: no paper pagination — one sheet per section, free height */
        document.body.removeChild(meas);
        host.appendChild(coverSheet);
        host.appendChild(tocSheet);
        PROPOSAL.pages.forEach((page) => {
          const sheet = newSheet(lang);
          const flow = sheet.querySelector(".sheet__flow");
          page.blocks.forEach((b) => {
            const node = block(b, lang);
            if (node) flow.appendChild(node);
            if (b.t === "h2" && !secPage[b.n]) secPage[b.n] = n;
          });
          sheets.push(sheet);
          host.appendChild(sheet);
          n += 1;
        });
      } else {
        let sheet = newSheet(lang);
        meas.appendChild(sheet);
        sheets.push(sheet);
        let flow = sheet.querySelector(".sheet__flow");
        let avail = availOf(sheet);

        PROPOSAL.pages.forEach((page) => {
          page.blocks.forEach((b) => {
            const node = block(b, lang);
            if (!node) return;
            flow.appendChild(node);

            const over = sheet.scrollHeight > sheet.clientHeight + 2 || flow.offsetHeight > avail;
            if (avail > 200 && over && flow.children.length > 1) {
              const carry = [flow.removeChild(node)];
              const prev = flow.lastElementChild;
              if (prev && (prev.classList.contains("t-h2") || prev.classList.contains("t-h3"))) {
                carry.unshift(flow.removeChild(prev));
              }
              sheet = newSheet(lang);
              meas.appendChild(sheet);
              sheets.push(sheet);
              flow = sheet.querySelector(".sheet__flow");
              avail = availOf(sheet);
              n += 1;
              carry.forEach((c) => flow.appendChild(c));
            }
            if (b.t === "h2" && !secPage[b.n]) secPage[b.n] = n;
          });
        });

        document.body.removeChild(meas);
        host.appendChild(coverSheet);
        host.appendChild(tocSheet);
        sheets.forEach((s) => host.appendChild(s));
      }

      /* folios, running heads, contents numbers */
      Array.from(host.querySelectorAll(".sheet")).forEach((s, i) => {
        if (i < 2) return;
        const num = i - 1;
        const fl = s.querySelector(".sheet__flow");
        if (fl && fl.children.length === 1 && fl.firstElementChild.classList.contains("t-close")) {
          s.classList.add("is-back");   // closing panel owns the whole sheet
        }
        s.dataset.page = String(num);
        const sec = s.querySelector(".sheet__sec");
        if (sec) sec.textContent = String(num).padStart(2, "0");
        const folio = s.querySelector(".sheet__foot b");
        if (folio) folio.textContent = String(num);
      });
      Array.from(tocSheet.querySelectorAll(".toc__row")).forEach((row, i) => {
        const entry = PROPOSAL.toc[i];
        const p = entry && secPage[entry.n];
        if (p) row.querySelector(".toc__p").textContent = String(p);
      });

      return { pages: n };
    }
  };
})();
