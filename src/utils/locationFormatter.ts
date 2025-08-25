// Map postcodes to area names
const postcodeToAreaMap: Record<string, string> = {
  // Central London
  'WC1': 'London Bloomsbury',
  'WC2': 'London Holborn',
  'EC1': 'London Clerkenwell',
  'EC2': 'London City',
  'EC3': 'London City',
  'EC4': 'London City',
  
  // West London
  'W1': 'London Marylebone',
  'W2': 'London Paddington',
  'W3': 'London Acton',
  'W4': 'London Chiswick',
  'W5': 'London Ealing',
  'W6': 'London Hammersmith',
  'W7': 'London Hanwell',
  'W8': 'London Kensington',
  'W9': 'London Maida Vale',
  'W10': 'London North Kensington',
  'W11': 'London Notting Hill',
  'W12': 'London Shepherds Bush',
  'W13': 'London West Ealing',
  'W14': 'London West Kensington',
  
  // North London
  'N1': 'London Islington',
  'N2': 'London East Finchley',
  'N3': 'London Finchley',
  'N4': 'London Finsbury Park',
  'N5': 'London Highbury',
  'N6': 'London Highgate',
  'N7': 'London Holloway',
  'N8': 'London Hornsey',
  'N9': 'London Lower Edmonton',
  'N10': 'London Muswell Hill',
  'N11': 'London New Southgate',
  'N12': 'London North Finchley',
  'N13': 'London Palmers Green',
  'N14': 'London Southgate',
  'N15': 'London Seven Sisters',
  'N16': 'London Stoke Newington',
  'N17': 'London Tottenham',
  'N18': 'London Upper Edmonton',
  'N19': 'London Archway',
  'N20': 'London Whetstone',
  'N21': 'London Winchmore Hill',
  'N22': 'London Wood Green',
  
  // South London
  'SW1': 'London Westminster',
  'SW2': 'London Brixton',
  'SW3': 'London Chelsea',
  'SW4': 'London Clapham',
  'SW5': 'London Earl\'s Court',
  'SW6': 'London Fulham',
  'SW7': 'London South Kensington',
  'SW8': 'London South Lambeth',
  'SW9': 'London Stockwell',
  'SW10': 'London West Brompton',
  'SW11': 'London Battersea',
  'SW12': 'London Balham',
  'SW13': 'London Barnes',
  'SW14': 'London East Sheen',
  'SW15': 'London Putney',
  'SW16': 'London Streatham',
  'SW17': 'London Tooting',
  'SW18': 'London Wandsworth',
  'SW19': 'London Wimbledon',
  'SW20': 'London Raynes Park',
  
  // South East London
  'SE1': 'London Southwark',
  'SE2': 'London Abbey Wood',
  'SE3': 'London Blackheath',
  'SE4': 'London Brockley',
  'SE5': 'London Camberwell',
  'SE6': 'London Catford',
  'SE7': 'London Charlton',
  'SE8': 'London Deptford',
  'SE9': 'London Eltham',
  'SE10': 'London Greenwich',
  'SE11': 'London Kennington',
  'SE12': 'London Lee',
  'SE13': 'London Lewisham',
  'SE14': 'London New Cross',
  'SE15': 'London Peckham',
  'SE16': 'London Rotherhithe',
  'SE17': 'London Walworth',
  'SE18': 'London Woolwich',
  'SE19': 'London Crystal Palace',
  'SE20': 'London Penge',
  'SE21': 'London Dulwich',
  'SE22': 'London East Dulwich',
  'SE23': 'London Forest Hill',
  'SE24': 'London Herne Hill',
  'SE25': 'London South Norwood',
  'SE26': 'London Sydenham',
  'SE27': 'London West Norwood',
  'SE28': 'London Thamesmead',
  
  // East London
  'E1': 'London Whitechapel',
  'E2': 'London Bethnal Green',
  'E3': 'London Bow',
  'E4': 'London Chingford',
  'E5': 'London Clapton',
  'E6': 'London East Ham',
  'E7': 'London Forest Gate',
  'E8': 'London Hackney',
  'E9': 'London Homerton',
  'E10': 'London Leyton',
  'E11': 'London Leytonstone',
  'E12': 'London Manor Park',
  'E13': 'London Plaistow',
  'E14': 'London Canary Wharf',
  'E15': 'London Stratford',
  'E16': 'London Canning Town',
  'E17': 'London Walthamstow',
  'E18': 'London South Woodford',
  'E20': 'London Olympic Park',
}

export const formatLocationDisplay = (location: string | null): string => {
  if (!location) return 'Location not specified'
  
  // Extract postcode pattern from location string
  const postcodeMatch = location.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?)\b/i)
  if (postcodeMatch) {
    const postcodePrefix = postcodeMatch[1].toUpperCase()
    const areaName = postcodeToAreaMap[postcodePrefix]
    if (areaName) {
      return areaName
    }
  }
  
  // If no postcode match or no area mapping found, return original location
  return location
}