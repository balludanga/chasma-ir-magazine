import type { User, Article, Category, Podcast, Comment, SiteSettings } from '@/types';

// Site Settings
export const siteSettings: SiteSettings = {
  siteName: 'Chasma IR Magazine',
  siteDescription: 'Expert analysis on International Relations, Foreign Policy, and Global Affairs',
  logo: '/logo.png',
  primaryColor: '#1e3a5f',
  socialLinks: {
    twitter: 'https://twitter.com/chasmaIR',
    facebook: 'https://facebook.com/chasmaIR',
    linkedin: 'https://linkedin.com/company/chasmaIR',
    youtube: 'https://youtube.com/chasmaIR',
  },
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    email: 'priya@chasma.ir',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    role: 'writer',
    bio: 'Senior Research Fellow at Centre for Strategic Studies. Specializes in India-China relations and Indo-Pacific security.',
    joinedAt: '2023-01-15',
    subscribers: 12500,
    isActive: true,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    email: 'rahul@chasma.ir',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    role: 'writer',
    bio: 'Foreign policy analyst with expertise in Middle East affairs and India-Gulf relations. Former diplomat.',
    joinedAt: '2023-02-20',
    subscribers: 8900,
    isActive: true,
  },
  {
    id: '3',
    name: 'Ananya Iyer',
    email: 'ananya@chasma.ir',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    role: 'writer',
    bio: 'Defense and strategic affairs commentator. Writes on military modernization and regional security architecture.',
    joinedAt: '2023-03-10',
    subscribers: 15200,
    isActive: true,
  },
  {
    id: '4',
    name: 'Prof. Arjun Nair',
    email: 'arjun@chasma.ir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    role: 'writer',
    bio: 'Professor of International Relations at JNU. Expert on great power politics and multilateral diplomacy.',
    joinedAt: '2023-04-05',
    subscribers: 6700,
    isActive: true,
  },
  {
    id: '5',
    name: 'Demo Reader',
    email: 'reader@chasma.ir',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    role: 'reader',
    joinedAt: '2024-01-01',
    isActive: true,
  },
  {
    id: '6',
    name: 'Admin User',
    email: 'admin@chasma.ir',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    role: 'admin',
    joinedAt: '2023-01-01',
    isActive: true,
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'c1',
    articleId: '1',
    author: mockUsers[4],
    content: 'Excellent analysis of the evolving India-China dynamic. The author brings valuable insights from field research.',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 24,
  },
  {
    id: 'c2',
    articleId: '1',
    author: mockUsers[1],
    content: 'This perspective on the border situation is particularly relevant given recent developments. Well researched.',
    createdAt: '2024-01-15T14:20:00Z',
    likes: 18,
  },
  {
    id: 'c3',
    articleId: '2',
    author: mockUsers[4],
    content: 'The Abraham Accords have indeed reshaped regional dynamics. India needs to recalibrate its approach.',
    createdAt: '2024-01-14T09:15:00Z',
    likes: 32,
  },
  {
    id: 'c4',
    articleId: '3',
    author: mockUsers[2],
    content: 'QUAD has evolved significantly from its initial conception. This article captures the transformation well.',
    createdAt: '2024-01-13T16:45:00Z',
    likes: 45,
  },
  {
    id: 'c5',
    articleId: '4',
    author: mockUsers[4],
    content: 'The economic implications of this partnership are substantial. Looking forward to more analysis.',
    createdAt: '2024-01-12T11:00:00Z',
    likes: 28,
  },
];

// Mock Articles
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'India-China Border Standoff: The New Normal in Eastern Ladakh',
    excerpt: 'As the fourth winter approaches, the standoff in eastern Ladakh has fundamentally altered India-China relations and regional security calculations.',
    content: `
      <p>The standoff in eastern Ladakh, now entering its fourth year, has fundamentally altered the India-China relationship. What began as a localized confrontation in the Galwan Valley has evolved into a comprehensive strategic competition that spans the entire bilateral relationship.</p>
      
      <h3>The Military Dimension</h3>
      <p>The deployment of over 50,000 troops on both sides of the Line of Actual Control (LAC) represents the largest military buildup in the region since the 1962 war. The Indian Army has adapted to this new reality by enhancing its infrastructure, improving surveillance capabilities, and restructuring its force posture.</p>
      
      <p>The creation of integrated battle groups, deployment of advanced weapon systems, and establishment of permanent habitats for troops signal a long-term commitment to maintaining credible deterrence. The focus has shifted from reactive border management to proactive defense preparation.</p>
      
      <h3>Diplomatic Deadlock</h3>
      <p>Despite 19 rounds of corps commander-level talks, the disengagement process remains incomplete. The Depsang Plains and Demchok areas continue to witness standoffs, with both sides maintaining forward positions that were previously unoccupied.</p>
      
      <p>The diplomatic dialogue has revealed fundamental differences in how the two countries perceive the border. While India insists on restoring the status quo ante of April 2020, China appears determined to maintain its gains and establish new facts on the ground.</p>
      
      <h3>Economic Decoupling</h3>
      <p>The border crisis has accelerated India's efforts to reduce economic dependence on China. From restricting Chinese investments to banning apps and scrutinizing imports, New Delhi has adopted a multi-pronged approach to economic decoupling.</p>
      
      <p>However, the trade figures tell a more complex story. Despite tensions, bilateral trade crossed $100 billion in 2022, with India's trade deficit widening. This economic reality constrains India's strategic options and highlights the challenges of decoupling.</p>
      
      <h3>The Regional Impact</h3>
      <p>The standoff has reshaped regional dynamics in ways that extend far beyond the LAC. India's closer alignment with the United States, enhanced engagement with the Quad, and deeper partnerships with European and Asian powers are partly responses to the China challenge.</p>
      
      <p>The crisis has also highlighted the importance of the Indo-Pacific construct and reinforced the convergence of interests between India and like-minded democracies concerned about China's rise.</p>
      
      <h3>Looking Ahead</h3>
      <p>As both countries prepare for a prolonged period of competition, the border standoff appears to be the new normal rather than a temporary aberration. Managing this competition while avoiding escalation will be the defining challenge for Indian strategic planners in the coming years.</p>
      
      <p>The resolution of the border dispute, if it happens, will likely be part of a broader understanding that addresses the fundamental drivers of the bilateral relationship rather than just the territorial issue.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
    category: 'Indo-Pacific',
    author: mockUsers[0],
    publishedAt: '2024-01-15',
    readTime: 8,
    likes: 342,
    comments: [mockComments[0], mockComments[1]],
    tags: ['india-china', 'border', 'ladakh', 'security', 'lac'],
    featured: true,
    trending: true,
    status: 'published',
    views: 12500,
  },
  {
    id: '2',
    title: 'The Abraham Accords: Implications for India\'s Middle East Policy',
    excerpt: 'The normalization agreements between Israel and Arab states are reshaping regional dynamics and creating new opportunities for Indian diplomacy.',
    content: `
      <p>The Abraham Accords, signed in 2020, marked a historic shift in Middle Eastern geopolitics. The normalization of relations between Israel and the United Arab Emirates, followed by Bahrain, Morocco, and Sudan, has created a new regional architecture with significant implications for India.</p>
      
      <h3>India's Strategic Conundrum</h3>
      <p>India has traditionally maintained strong relationships with both Israel and the Arab world. The Abraham Accords have eased some of the tensions inherent in this balancing act, allowing India to deepen ties with all parties simultaneously.</p>
      
      <p>However, the new regional dynamics also present challenges. As Israel becomes more integrated into the Gulf security architecture, India must navigate complex relationships while pursuing its own interests in the region.</p>
      
      <h3>Economic Opportunities</h3>
      <p>The accords have opened new avenues for economic cooperation. The India-UAE Comprehensive Economic Partnership Agreement (CEPA), signed in 2022, is a testament to the growing economic ties between India and the Gulf.</p>
      
      <p>Trilateral cooperation involving India, Israel, and the UAE has emerged as a new template for regional engagement. The I2U2 grouping, which also includes the United States, focuses on economic cooperation in areas like energy, food security, and technology.</p>
      
      <h3>Security Cooperation</h3>
      <p>The convergence of interests between Israel and Gulf states on Iran has created new opportunities for security cooperation. India, which maintains relations with all parties, is well-positioned to benefit from enhanced regional security dialogue.</p>
      
      <p>The growing threat from Iran-backed proxies and the need for maritime security in the Arabian Sea have created common ground for cooperation between India, Israel, and Gulf states.</p>
      
      <h3>The Palestinian Question</h3>
      <p>Despite the Abraham Accords, the Palestinian issue remains a sensitive topic. India has maintained its traditional support for the two-state solution while adapting to the new regional realities.</p>
      
      <p>The challenge for Indian diplomacy is to balance its growing ties with Israel and Gulf states with its historical commitment to Palestinian self-determination.</p>
      
      <h3>Looking Forward</h3>
      <p>The Abraham Accords represent a fundamental shift in Middle Eastern geopolitics that is likely to endure. For India, this presents both opportunities and challenges as it seeks to deepen its engagement with a rapidly transforming region.</p>
      
      <p>The key to success will be maintaining the delicate balance while pursuing concrete cooperation in areas of mutual interest.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1545063914-1a0c695355e5?w=1200&h=800&fit=crop',
    category: 'Middle East',
    author: mockUsers[1],
    publishedAt: '2024-01-14',
    readTime: 7,
    likes: 567,
    comments: [mockComments[2]],
    tags: ['abraham-accords', 'middle-east', 'israel', 'uae', 'gulf'],
    featured: true,
    trending: true,
    status: 'published',
    views: 9800,
  },
  {
    id: '3',
    title: 'QUAD 2.0: From Dialogue to Deliverables',
    excerpt: 'The Quadrilateral Security Dialogue has evolved from a tentative forum to a substantive mechanism for Indo-Pacific cooperation.',
    content: `
      <p>The Quadrilateral Security Dialogue, commonly known as the Quad, has undergone a remarkable transformation since its revival in 2017. What began as a tentative dialogue among four like-minded democracies has evolved into a substantive mechanism for regional cooperation.</p>
      
      <h3>The Evolution</h3>
      <p>The Quad's journey has been marked by fits and starts. The initial attempt in 2007-08 faltered due to concerns about provoking China. The revived Quad, however, has proven more resilient, driven by shared concerns about Chinese assertiveness and the need for regional stability.</p>
      
      <p>The elevation of the Quad to the summit level in 2021 marked a significant milestone. The leaders' commitment to regular meetings and concrete deliverables has given the mechanism new momentum.</p>
      
      <h3>Key Deliverables</h3>
      <p>The Quad has moved beyond strategic dialogue to deliver tangible benefits for the region. The Quad Vaccine Partnership, which committed to delivering 1.2 billion COVID-19 vaccine doses to Indo-Pacific countries, demonstrated the group's capacity for collective action.</p>
      
      <p>Other initiatives include the Indo-Pacific Maritime Domain Awareness partnership, which enhances maritime security cooperation, and the Quad Infrastructure Coordination Group, which supports quality infrastructure development.</p>
      
      <h3>The China Factor</h3>
      <p>While the Quad leaders have been careful not to explicitly name China, the grouping's focus on a free and open Indo-Pacific, respect for international law, and opposition to coercion clearly targets Chinese behavior.</p>
      
      <p>The Quad's evolution has been shaped by China's actions in the South China Sea, its economic coercion, and its challenge to the rules-based international order.</p>
      
      <h3>Challenges and Limitations</h3>
      <p>Despite its progress, the Quad faces significant challenges. The four members have different threat perceptions and strategic priorities. India's non-aligned traditions and its border standoff with China create unique constraints on its Quad participation.</p>
      
      <p>The Quad is also not a military alliance, and its members have been clear about this limitation. The grouping focuses on non-traditional security, economic cooperation, and capacity building rather than collective defense.</p>
      
      <h3>The Road Ahead</h3>
      <p>The Quad's future will depend on its ability to deliver concrete benefits for the region while managing the expectations of its members. The grouping's success will be measured not by its rhetoric but by its ability to shape the regional order in ways that benefit all stakeholders.</p>
      
      <p>As the Indo-Pacific becomes the center of global geopolitics, the Quad's role in shaping regional dynamics will only grow in importance.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1200&h=800&fit=crop',
    category: 'Indo-Pacific',
    author: mockUsers[2],
    publishedAt: '2024-01-13',
    readTime: 6,
    likes: 423,
    comments: [mockComments[3]],
    tags: ['quad', 'indo-pacific', 'us', 'japan', 'australia'],
    featured: true,
    trending: false,
    status: 'published',
    views: 8700,
  },
  {
    id: '4',
    title: 'India-Russia Relations: Navigating the New Cold War',
    excerpt: 'The Ukraine crisis has put India-Russia ties under strain, but New Delhi continues to value its longstanding partnership with Moscow.',
    content: `
      <p>The Russian invasion of Ukraine in February 2022 created a complex challenge for Indian foreign policy. As a longstanding partner of Russia and a member of the Quad, India found itself in a difficult position that required careful diplomatic navigation.</p>
      
      <h3>India's Balancing Act</h3>
      <p>India's response to the Ukraine crisis was marked by strategic ambiguity. New Delhi abstained from UN resolutions condemning Russia while calling for respect for territorial integrity and the cessation of hostilities.</p>
      
      <p>This balancing act reflected India's desire to maintain its strategic autonomy while avoiding alienating either Russia or the West. The approach drew criticism from Western capitals but was largely understood as a reflection of India's complex strategic realities.</p>
      
      <h3>The Defense Dimension</h3>
      <p>Russia remains India's largest defense supplier, accounting for approximately 60% of India's military equipment. This dependence creates significant constraints on India's ability to distance itself from Moscow.</p>
      
      <p>The S-400 missile defense system deal, signed in 2018, exemplifies the depth of defense ties. Despite US sanctions threats, India has proceeded with the acquisition, highlighting the priority attached to the Russia relationship.</p>
      
      <h3>Economic Ties</h3>
      <p>The Ukraine crisis has paradoxically strengthened economic ties between India and Russia. With Western sanctions limiting Russia's options, Moscow has turned to India as a market for its energy and commodities.</p>
      
      <p>India's purchase of discounted Russian oil has drawn criticism from the West but has served India's economic interests. The bilateral trade has surged to record levels, though the composition remains heavily skewed toward Russian exports.</p>
      
      <h3>The China Factor</h3>
      <p>The growing Russia-China partnership is a source of concern for India. The no-limits partnership declared by Putin and Xi in 2022 has raised questions about Russia's reliability as a strategic partner.</p>
      
      <p>However, India also sees value in maintaining a relationship with Russia that can provide some leverage against the Sino-Russian alignment. Moscow's neutrality, or at least restraint, during the Ladakh standoff has been noted in New Delhi.</p>
      
      <h3>Looking Ahead</h3>
      <p>The future of India-Russia relations will be shaped by the trajectory of the Ukraine conflict and the broader geopolitical realignment. As Russia becomes more dependent on China, India's ability to maintain a balanced relationship will become more challenging.</p>
      
      <p>Yet, the relationship retains value for both sides, and a complete rupture is unlikely. The challenge for Indian diplomacy is to manage this relationship while deepening ties with the West and the Indo-Pacific partners.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200&h=800&fit=crop',
    category: 'Great Powers',
    author: mockUsers[3],
    publishedAt: '2024-01-12',
    readTime: 8,
    likes: 289,
    comments: [mockComments[4]],
    tags: ['russia', 'ukraine', 'defense', 'energy', 'china'],
    featured: false,
    trending: true,
    status: 'published',
    views: 7600,
  },
  {
    id: '5',
    title: 'ASEAN Centrality and India\'s Act East Policy',
    excerpt: 'As ASEAN faces internal and external challenges, India\'s engagement with Southeast Asia takes on renewed significance.',
    content: `
      <p>ASEAN centrality has long been a cornerstone of the regional architecture in Southeast Asia. However, the concept faces growing challenges from great power competition, internal divisions, and the organization's own limitations.</p>
      
      <h3>India's Act East Policy</h3>
      <p>India's Act East Policy, which evolved from the earlier Look East Policy, represents a strategic commitment to deeper engagement with Southeast Asia. The policy encompasses economic, political, security, and cultural dimensions.</p>
      
      <p>India's engagement with ASEAN has deepened significantly, with the two sides elevating their relationship to a strategic partnership and implementing a free trade agreement. However, the potential for deeper cooperation remains underutilized.</p>
      
      <h3>The China Challenge</h3>
      <p>China's assertiveness in the South China Sea has created both opportunities and challenges for India-ASEAN relations. While ASEAN members welcome India as a balancing factor, they are also wary of being drawn into great power competition.</p>
      
      <p>The divided response within ASEAN to Chinese assertiveness reflects the organization's internal diversity and the different strategic calculations of its members.</p>
      
      <h3>Connectivity and Infrastructure</h3>
      <p>Connectivity has emerged as a key area of India-ASEAN cooperation. Projects like the India-Myanmar-Thailand Trilateral Highway and the Kaladan Multi-Modal Transit Transport Project aim to enhance physical linkages.</p>
      
      <p>However, progress has been slow, and the projects face significant implementation challenges. The Myanmar crisis has further complicated connectivity initiatives.</p>
      
      <h3>Maritime Cooperation</h3>
      <p>The maritime domain offers significant opportunities for India-ASEAN cooperation. India's naval engagement with Southeast Asian countries has increased, with more frequent port visits, exercises, and capacity-building initiatives.</p>
      
      <p>The Indo-Pacific Oceans Initiative, proposed by India, has found resonance in ASEAN capitals concerned about maritime security and freedom of navigation.</p>
      
      <h3>The Way Forward</h3>
      <p>Deepening India-ASEAN relations will require sustained political attention, economic integration, and security cooperation. As the regional order evolves, the importance of this partnership will only grow.</p>
      
      <p>For India, ASEAN represents a critical component of its Indo-Pacific strategy and a bridge to the wider Asia-Pacific region.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&h=800&fit=crop',
    category: 'South Asia',
    author: mockUsers[0],
    publishedAt: '2024-01-11',
    readTime: 6,
    likes: 512,
    comments: [],
    tags: ['asean', 'act-east', 'southeast-asia', 'connectivity'],
    featured: false,
    trending: true,
    status: 'published',
    views: 6500,
  },
  {
    id: '6',
    title: 'The Future of the Nuclear Non-Proliferation Regime',
    excerpt: 'As the global nuclear order faces unprecedented challenges, India\'s position as a responsible nuclear power becomes increasingly important.',
    content: `
      <p>The nuclear non-proliferation regime, built around the Nuclear Non-Proliferation Treaty (NPT), faces unprecedented challenges. The regime's credibility has been eroded by nuclear modernization, the collapse of arms control agreements, and the emergence of new nuclear powers.</p>
      
      <h3>India's Nuclear Journey</h3>
      <p>India's nuclear program has evolved from a peaceful nuclear explosion in 1974 to a full-fledged nuclear arsenal. The 1998 nuclear tests marked India's formal entry into the nuclear club, despite international condemnation and sanctions.</p>
      
      <p>The India-US Civil Nuclear Agreement of 2008 represented a significant shift, effectively recognizing India as a responsible nuclear power despite its non-NPT status. The waiver from the Nuclear Suppliers Group opened the door for international nuclear commerce with India.</p>
      
      <h3>The NPT's Limitations</h3>
      <p>The NPT's discriminatory nature, which recognizes five nuclear-weapon states while prohibiting others from acquiring such weapons, has been a long-standing Indian concern. The treaty's failure to achieve nuclear disarmament has further undermined its legitimacy.</p>
      
      <p>The emergence of new nuclear powers outside the NPT framework, including India, Pakistan, and Israel, has created a reality that the regime struggles to accommodate.</p>
      
      <h3>Strategic Stability in South Asia</h3>
      <p>The India-Pakistan nuclear dyad remains a source of concern, given the history of conflicts and the presence of terrorist groups. The development of tactical nuclear weapons by Pakistan has further complicated the deterrence calculus.</p>
      
      <p>India's no-first-use policy and its commitment to credible minimum deterrence have contributed to strategic stability, though these doctrines are periodically debated within India.</p>
      
      <h3>The China Dimension</h3>
      <p>China's nuclear modernization and its expansion of the arsenal have implications for India's nuclear posture. The India-China nuclear asymmetry, with China possessing a larger and more sophisticated arsenal, shapes India's deterrence requirements.</p>
      
      <p>The possibility of a two-front nuclear scenario, involving both China and Pakistan, adds complexity to India's nuclear planning.</p>
      
      <h3>Looking Ahead</h3>
      <p>The future of the global nuclear order will be shaped by great power dynamics, technological developments, and the evolution of deterrence concepts. India's role as a responsible nuclear power with advanced capabilities will be significant in this evolving landscape.</p>
      
      <p>The challenge for India is to maintain a credible deterrent while contributing to global efforts to prevent nuclear proliferation and promote disarmament.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&h=800&fit=crop',
    category: 'Defence',
    author: mockUsers[2],
    publishedAt: '2024-01-10',
    readTime: 9,
    likes: 378,
    comments: [],
    tags: ['nuclear', 'npt', 'disarmament', 'deterrence'],
    featured: false,
    trending: false,
    status: 'published',
    views: 5400,
  },
  {
    id: '7',
    title: 'Climate Change and Global Security: The Emerging Threat',
    excerpt: 'As climate impacts intensify, the security implications of environmental change are becoming impossible to ignore.',
    content: `
      <p>Climate change is increasingly recognized as a threat multiplier that exacerbates existing security challenges and creates new ones. From resource scarcity to mass migration, the security implications of climate change are far-reaching and complex.</p>
      
      <h3>The Security Dimension</h3>
      <p>The traditional conception of security, focused on military threats, is being expanded to include environmental challenges. Climate change affects security through multiple pathways, including resource competition, humanitarian crises, and geopolitical tensions.</p>
      
      <p>The melting of Arctic ice, for example, is opening new shipping routes and creating competition for resources. The melting of Himalayan glaciers poses existential threats to water security in South Asia.</p>
      
      <h3>India's Vulnerability</h3>
      <p>India is among the countries most vulnerable to climate change. The impacts range from extreme weather events and changing monsoon patterns to sea-level rise and glacial melt.</p>
      
      <p>The security implications for India are significant. Water disputes with neighbors, internal migration, and pressure on agricultural systems all have potential to create instability.</p>
      
      <h3>The Global Response</h3>
      <p>The international community has begun to address the security implications of climate change. The UN Security Council has held debates on climate security, and several countries have integrated climate into their national security strategies.</p>
      
      <p>However, the response remains inadequate given the scale of the challenge. The gap between climate commitments and actions continues to widen, increasing the security risks.</p>
      
      <h3>Climate and Conflict</h3>
      <p>The relationship between climate change and conflict is complex and context-dependent. While climate stressors can exacerbate existing tensions, they do not automatically lead to conflict. Governance, institutions, and social resilience play crucial mediating roles.</p>
      
      <p>Understanding these dynamics is essential for developing effective climate security policies and preventing climate-induced conflicts.</p>
      
      <h3>The Way Forward</h3>
      <p>Addressing climate security requires both mitigation and adaptation. Reducing greenhouse gas emissions is essential to limit the severity of climate impacts, while adaptation measures can enhance resilience to unavoidable changes.</p>
      
      <p>For India, integrating climate considerations into national security planning and foreign policy will be crucial for managing the emerging threats.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
    category: 'Economics',
    author: mockUsers[3],
    publishedAt: '2024-01-09',
    readTime: 7,
    likes: 445,
    comments: [],
    tags: ['climate-change', 'security', 'environment', 'water'],
    featured: false,
    trending: true,
    status: 'published',
    views: 4800,
  },
  {
    id: '8',
    title: 'Artificial Intelligence and the Future of Warfare',
    excerpt: 'The integration of AI into military systems is transforming the nature of conflict and raising new ethical and strategic questions.',
    content: `
      <p>Artificial intelligence is poised to transform warfare in ways that rival the impact of nuclear weapons. From autonomous systems to intelligent decision support, AI is being integrated into military capabilities across the spectrum.</p>
      
      <h3>The AI Revolution</h3>
      <p>The military applications of AI are vast and growing. Autonomous drones, intelligent surveillance systems, predictive maintenance, and AI-enabled command and control are just some of the areas where AI is being deployed.</p>
      
      <p>The integration of AI into military systems promises to enhance capabilities while reducing costs and risks to personnel. However, it also raises profound questions about the nature of warfare and the role of human judgment.</p>
      
      <h3>Lethal Autonomous Weapons</h3>
      <p>The development of lethal autonomous weapons systems (LAWS) has sparked intense debate. These systems, capable of selecting and engaging targets without human intervention, raise ethical, legal, and strategic concerns.</p>
      
      <p>The Campaign to Stop Killer Robots has called for a preemptive ban on such weapons, while some countries argue that existing international law is sufficient to regulate their use.</p>
      
      <h3>The China Challenge</h3>
      <p>China has identified AI as a key strategic technology and is investing heavily in its development. The Chinese military sees AI as a way to offset US conventional superiority and achieve strategic advantage.</p>
      
      <p>The US-China competition in AI has significant implications for global security. The race to develop and deploy AI-enabled military capabilities could increase instability and the risk of conflict.</p>
      
      <h3>India's AI Strategy</h3>
      <p>India has recognized the importance of AI for national security and has initiated efforts to develop indigenous capabilities. The establishment of the Centre for Artificial Intelligence and Robotics (CAIR) and other initiatives reflect this priority.</p>
      
      <p>However, India faces significant challenges in AI development, including limited investment, talent shortages, and infrastructure constraints. Addressing these challenges will be essential for maintaining strategic relevance.</p>
      
      <h3>Governance and Ethics</h3>
      <p>The governance of AI in warfare is an emerging challenge. The international community is grappling with questions of regulation, norms, and the ethical use of AI in military contexts.</p>
      
      <p>India has an opportunity to contribute to the development of international norms on AI in warfare, drawing on its tradition of ethical leadership and its growing technological capabilities.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop',
    category: 'Technology',
    author: mockUsers[2],
    publishedAt: '2024-01-08',
    readTime: 8,
    likes: 623,
    comments: [],
    tags: ['artificial-intelligence', 'warfare', 'autonomous-weapons', 'technology'],
    featured: false,
    trending: false,
    status: 'published',
    views: 7200,
  },
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'South Asia',
    slug: 'south-asia',
    description: 'Regional dynamics, bilateral relations, and security issues in South Asia.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=1000&fit=crop',
    articleCount: 24,
    isActive: true,
  },
  {
    id: '2',
    name: 'Indo-Pacific',
    slug: 'indo-pacific',
    description: 'Strategic developments and great power competition in the Indo-Pacific region.',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=1000&fit=crop',
    articleCount: 36,
    isActive: true,
  },
  {
    id: '3',
    name: 'Middle East',
    slug: 'middle-east',
    description: 'Political, economic, and security developments in the Middle East and Gulf region.',
    image: 'https://images.unsplash.com/photo-1545063914-1a0c695355e5?w=800&h=1000&fit=crop',
    articleCount: 18,
    isActive: true,
  },
  {
    id: '4',
    name: 'Great Powers',
    slug: 'great-powers',
    description: 'Analysis of major power relations and their impact on global order.',
    image: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800&h=1000&fit=crop',
    articleCount: 28,
    isActive: true,
  },
  {
    id: '5',
    name: 'Defence',
    slug: 'defence',
    description: 'Military modernization, defense policy, and strategic capabilities.',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=1000&fit=crop',
    articleCount: 22,
    isActive: true,
  },
  {
    id: '6',
    name: 'Economics',
    slug: 'economics',
    description: 'Trade, investment, and economic dimensions of foreign policy.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1000&fit=crop',
    articleCount: 15,
    isActive: true,
  },
  {
    id: '7',
    name: 'Technology',
    slug: 'technology',
    description: 'Emerging technologies and their implications for international relations.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=1000&fit=crop',
    articleCount: 12,
    isActive: true,
  },
];

// Mock Podcasts
export const mockPodcasts: Podcast[] = [
  {
    id: '1',
    title: 'The Geopolitics of Energy Transition',
    description: 'Exploring how the shift to renewable energy is reshaping global power dynamics and international relations.',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=600&fit=crop',
    duration: '45:22',
    publishedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Understanding the Quad: Origins and Evolution',
    description: 'A deep dive into the Quadrilateral Security Dialogue and its role in the Indo-Pacific.',
    coverImage: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=600&h=600&fit=crop',
    duration: '52:18',
    publishedAt: '2024-01-12',
  },
  {
    id: '3',
    title: 'India\'s G20 Presidency: A Retrospective',
    description: 'Analyzing the outcomes and implications of India\'s year at the helm of the G20.',
    coverImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=600&fit=crop',
    duration: '38:45',
    publishedAt: '2024-01-10',
  },
  {
    id: '4',
    title: 'The Future of India-Pakistan Relations',
    description: 'Examining the prospects for normalization and the obstacles to peace.',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    duration: '41:33',
    publishedAt: '2024-01-08',
  },
];
