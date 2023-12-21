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