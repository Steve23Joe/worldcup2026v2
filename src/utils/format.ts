export function safePct(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return '—'
  if (v > 1 && v <= 100) return v.toFixed(1) + '%'
  if (v >= 0 && v <= 1) return (v * 100).toFixed(1) + '%'
  return Math.max(0, Math.min(100, v)).toFixed(0) + '%'
}

export function fmtDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso.replace('Z', '+00:00'))
    return d.toLocaleString('zh-CN', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Shanghai',
    })
  } catch { return iso }
}

export function fmtDateShort(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso.replace('Z', '+00:00'))
    return d.toLocaleString('zh-CN', {
      month: 'short', day: 'numeric', timeZone: 'Asia/Shanghai',
    })
  } catch { return iso }
}

export function resultLabel(r: string): string {
  const m: Record<string, string> = {
    home_win: '主胜', draw: '平局', away_win: '客胜',
  }
  return m[r] || r
}

export function teamResultLabel(r: string, home: string, away: string): string {
  if (r === 'home_win') return `${home} 胜`
  if (r === 'away_win') return `${away} 胜`
  return '平局'
}

export function confLabel(c: string): string {
  const m: Record<string, string> = { high: '🟢 高', medium: '🟡 中', low: '🔴 低' }
  return m[c] || c
}

export function scoreConfLabel(c: string): string {
  return c === 'medium' ? '🟡 中' : '🔴 低'
}

export function stageLabel(s: string): string {
  const m: Record<string, string> = {
    group: '小组赛', round_of_32: '32强赛',
    round_of_16: '16强赛', quarterfinal: '四分之一决赛',
    semifinal: '半决赛', third_place: '季军赛', final: '决赛',
  }
  return m[s] || s
}

const teamNamesCn: Record<string, string> = {
  Argentina: '阿根廷', Bolivia: '玻利维亚', Brazil: '巴西', Chile: '智利',
  Colombia: '哥伦比亚', Ecuador: '厄瓜多尔', Paraguay: '巴拉圭', Peru: '秘鲁',
  Uruguay: '乌拉圭', Venezuela: '委内瑞拉', Canada: '加拿大', 'Costa Rica': '哥斯达黎加',
  Jamaica: '牙买加', Mexico: '墨西哥', Panama: '巴拿马', 'United States': '美国',
  Algeria: '阿尔及利亚', Cameroon: '喀麦隆', "Cote d'Ivoire": '科特迪瓦',
  'Ivory Coast': '科特迪瓦', 'DR Congo': '刚果民主共和国', 'Congo DR': '刚果民主共和国',
  Egypt: '埃及', Ghana: '加纳', Mali: '马里', Morocco: '摩洛哥',
  Nigeria: '尼日利亚', Senegal: '塞内加尔', 'South Africa': '南非',
  Tunisia: '突尼斯', 'Cape Verde': '佛得角', Australia: '澳大利亚',
  China: '中国', Iran: '伊朗', Iraq: '伊拉克', Japan: '日本',
  Jordan: '约旦', Kuwait: '科威特', 'North Korea': '朝鲜', Qatar: '卡塔尔',
  'Saudi Arabia': '沙特阿拉伯', 'South Korea': '韩国',
  'United Arab Emirates': '阿联酋', Uzbekistan: '乌兹别克斯坦',
  Austria: '奥地利', Belgium: '比利时', Croatia: '克罗地亚',
  Denmark: '丹麦', England: '英格兰', France: '法国', Germany: '德国',
  Greece: '希腊', Iceland: '冰岛', Italy: '意大利', Netherlands: '荷兰',
  Norway: '挪威', Poland: '波兰', Portugal: '葡萄牙',
  'Republic of Ireland': '爱尔兰', Romania: '罗马尼亚', Serbia: '塞尔维亚',
  Slovakia: '斯洛伐克', Spain: '西班牙', Sweden: '瑞典',
  Switzerland: '瑞士', Turkey: '土耳其', Türkiye: '土耳其',
  Ukraine: '乌克兰', 'New Zealand': '新西兰', Scotland: '苏格兰',
  Czechia: '捷克', 'Bosnia-Herzegovina': '波黑', Haiti: '海地', 'Curaçao': '库拉索',
}

export function teamNameCn(name: string): string {
  return teamNamesCn[name] || name
}

export function statusLabel(s: string): string {
  const m: Record<string, string> = {
    completed: '已结束', scheduled: '未开始',
    in_progress: '进行中',
  }
  return m[s] || s
}
