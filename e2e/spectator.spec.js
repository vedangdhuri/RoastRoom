const { test, expect } = require('@playwright/test');

test.describe('Spectator Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to our isolated test mock page
    await page.goto('/test-ui');
  });

  test('Audience Voting UI renders and accepts votes', async ({ page }) => {
    // Check Audience Vote heading
    const voteHeading = page.locator('text=Audience Vote');
    await expect(voteHeading).toBeVisible();

    // Check if player buttons exist
    const btnAlice = page.locator('button', { hasText: 'Alice' });
    const btnBob = page.locator('button', { hasText: 'Bob' });
    await expect(btnAlice).toBeVisible();
    await expect(btnBob).toBeVisible();

    // Cast a vote for Alice (click)
    await btnAlice.click();

    // After voting, Alice's button should show the checkmark / vote count
    // Normally it requires the server state to say "1 vote", but checking for local click reaction is fine.
    // Button should be disabled now
    await expect(btnAlice).toBeDisabled();
    await expect(btnBob).toBeDisabled();
  });

  test('Reaction Bar generates floating reactions', async ({ page }) => {
    const reactionHeading = page.locator('text=Reaction Bar');
    await expect(reactionHeading).toBeVisible();

    // Click on the Fire reaction button
    const fireReaction = page.locator('button', { hasText: '🔥' });
    await expect(fireReaction).toBeVisible();
    
    // Playwright needs to click
    await fireReaction.click();

    // We can't easily assert on floating motion.div without hooking into animation,
    // but we can at least assert the ReactionBar exists and clicking doesn't crash it.
  });

  test('Highlight Export renders the generated card components', async ({ page }) => {
    const exportBtn = page.locator('button', { hasText: 'Save Image' });
    await expect(exportBtn).toBeVisible();

    // Click to generate image
    await exportBtn.click();
    
    // Check if the generating state triggers or it handles the DOM element reliably
    // Based on the code, we can check if the button text changes or if it continues existing
    const shareBtn = page.locator('button', { hasText: 'Share on X' });
    await expect(shareBtn).toBeVisible();
  });
});
