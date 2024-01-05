/**
 * Calcul de la mensualité de l'emprunt et du cout total
 * @param capital valeur emprunté
 * @param time temps de remboursement en année
 * @param interest taux d'interet
 * @returns {array} mensualité / cout total de l'emprunt
 */
export const calculateLoan = (capital: number, time: number, interest: number) => {
  if(interest === 0) return [Math.round(capital/(time*12)), 0]

  const pInterest = interest/100
  const numerateur = capital * pInterest / 12
  const denominateur = 1 - 1/((1 + pInterest/12)**(time*12))

  const monthCost = numerateur/denominateur
  const fullCost = (monthCost - capital/(time*12))*time*12

  return [Math.round(monthCost), Math.round(fullCost)]
}

/**
 * @param capital 
 * @param interest 
 * @returns 
 */
export const loanStartData = (capital: number, interest: number) => {
  const loan5 = calculateLoan(capital, 5, interest)
    const loan10 = calculateLoan(capital, 10, interest)
    const loan15 = calculateLoan(capital, 15, interest)
    const loan20 = calculateLoan(capital, 20, interest)
    const loan25 = calculateLoan(capital, 25, interest)

    return [
      {
        temps: 5,
        value: loan5[0],
        cost: loan5[1]
      },
      {
        temps: 10,
        value: loan10[0],
        cost: loan10[1]
      },
      {
        temps: 15,
        value: loan15[0],
        cost: loan15[1]
      },
      {
        temps: 20,
        value: loan20[0],
        cost: loan20[1]
      },
      {
        temps: 25,
        value: loan25[0],
        cost: loan25[1]
      }
    ]
}

export const decilesStartData = [
  {
    value: 1366,
    percile: 10
  },
  {
    value: 1520,
    percile: 20
  },
  {
    value: 1664,
    percile: 30
  },
  {
    value: 1825,
    percile: 40
  },
  {
    value: 2012,
    percile: 50
  },
  {
    value: 2243,
    percile: 60
  },
  {
    value: 2558,
    percile: 70
  },
  {
    value: 3041,
    percile: 80
  },
  {
    value: 4010,
    percile: 90
  },
  {
    value: 5211,
    percile: 95
  },
  {
    value: 9602,
    percile: 99
  }
]