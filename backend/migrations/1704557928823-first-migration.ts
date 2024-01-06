// Import your models here
import { getModels } from '../src/config/migration'

export async function up (): Promise<void> {
  // Write migration here
  const { User } = await getModels()
  // Write migration here
  await User.updateMany({}, {
    allowGoal: false
  })
}

export async function down (): Promise<void> {
  // Write migration here
}
